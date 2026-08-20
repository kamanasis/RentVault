/**
 * sorobanEvents.js — Level 2C: Real Soroban Contract Event Streaming
 *
 * Architecture:
 *   SOROBAN BLOCKCHAIN
 *       ↓  (env.events().publish)
 *   REAL CONTRACT EVENT (escrow/locked, escrow/release)
 *       ↓  (RPC polling via getEvents)
 *   sorobanEvents.js listener
 *       ↓
 *   onEvent callback → Firebase → React UI
 *
 * Mechanism: RPC polling (the Soroban Testnet RPC does not expose a WebSocket
 * subscription endpoint — this IS polling, not WebSocket streaming).
 *
 * Events emitted by the Rust contract:
 *   lock_deposit   → publish(("escrow","locked"),  agreement_id)
 *   release_deposit → publish(("escrow","release"), agreement_id)
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { SOROBAN_CONTRACT_ID, sorobanServer } from './escrowContract';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Poll every 5 seconds. Stellar ledger closes every ~5s. */
const POLL_INTERVAL_MS = 5000;

/** Max consecutive RPC failures before backing off. */
const MAX_CONSECUTIVE_FAILURES = 5;

/** Back-off interval after repeated failures. */
const BACKOFF_INTERVAL_MS = 30_000;

/** localStorage key for persisting the event cursor across refreshes. */
const CURSOR_STORAGE_KEY = 'rv_soroban_event_cursor';

/** localStorage key for processed event ID set (dedup). */
const PROCESSED_IDS_STORAGE_KEY = 'rv_soroban_processed_event_ids';

/** Maximum size of the processed-ID set persisted to localStorage. */
const MAX_PROCESSED_IDS = 500;

/**
 * The ledger at which the RentVault escrow contract was first deployed.
 * On first run (no stored cursor), the listener scans from this ledger
 * so that ALL historical events from this contract are detected, including
 * the proven real event at ledger 4242581
 * (tx: 2d6758e2adc05dff2f563c454034304873889d4781a114dc5d9fa69501b83593).
 *
 * The Soroban Testnet RPC retains events for a rolling window of ~100k ledgers
 * (~7 days). Events older than that window are no longer accessible.
 */
const CONTRACT_DEPLOY_LEDGER = 4242500;

// ─── Topic Decoding ───────────────────────────────────────────────────────────

/**
 * Decodes a single Soroban ScVal topic to a plain string.
 * Handles both raw XDR ScVal objects and pre-decoded SDK value objects.
 */
function decodeTopicToString(scval) {
  try {
    // The SDK returns topics as XDR ScVal objects; use scValToNative for
    // symbols and strings. Symbols come back as plain strings.
    const native = StellarSdk.scValToNative(scval);
    if (typeof native === 'string') return native;
    if (typeof native === 'symbol') return native.toString().replace('Symbol(', '').replace(')', '');
    return String(native);
  } catch {
    // Fall back to raw buffer inspection for symbols
    try {
      if (scval && scval._arm === 'sym' && scval._value) {
        return Buffer.from(scval._value.data || scval._value).toString('utf8');
      }
    } catch {
      // ignore
    }
    return '';
  }
}

/**
 * Decodes the event value ScVal to a plain JS value.
 * For escrow events the value is always the agreement_id (Soroban String).
 */
function decodeEventValue(scval) {
  try {
    return StellarSdk.scValToNative(scval);
  } catch {
    // Fallback for raw buffer
    try {
      if (scval && scval._arm === 'str' && scval._value) {
        return Buffer.from(scval._value.data || scval._value).toString('utf8');
      }
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Parses a raw RPC event object into a structured RentVault event.
 * Returns null if the event is not a recognized RentVault escrow event.
 *
 * @param {object} rawEvent — event object from sorobanServer.getEvents()
 * @returns {{ eventId, type, agreementId, txHash, ledger, ledgerClosedAt } | null}
 */
export function parseRentVaultEvent(rawEvent) {
  if (!rawEvent || !Array.isArray(rawEvent.topic) || rawEvent.topic.length < 2) {
    return null;
  }

  const topic0 = decodeTopicToString(rawEvent.topic[0]);
  const topic1 = decodeTopicToString(rawEvent.topic[1]);

  // Only handle our contract's escrow events
  if (topic0 !== 'escrow') return null;

  let type = null;
  if (topic1 === 'locked') type = 'ESCROW_LOCKED';
  else if (topic1 === 'release') type = 'ESCROW_RELEASED';
  else return null;

  const agreementId = decodeEventValue(rawEvent.value);
  if (!agreementId || typeof agreementId !== 'string') return null;

  return {
    eventId: rawEvent.id,                    // e.g. "0018221746645671936-0000000001"
    type,
    agreementId,
    txHash: rawEvent.txHash || null,
    ledger: rawEvent.ledger || null,
    ledgerClosedAt: rawEvent.ledgerClosedAt || null,
    contractId: rawEvent.contractId || SOROBAN_CONTRACT_ID,
    inSuccessfulContractCall: rawEvent.inSuccessfulContractCall ?? true,
  };
}

// ─── Cursor Persistence ───────────────────────────────────────────────────────

function loadCursor() {
  try {
    return localStorage.getItem(CURSOR_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function saveCursor(cursor) {
  try {
    if (cursor) localStorage.setItem(CURSOR_STORAGE_KEY, cursor);
  } catch {
    // ignore (private browsing)
  }
}

// ─── Processed-Event Deduplication ───────────────────────────────────────────

function loadProcessedIds() {
  try {
    const raw = localStorage.getItem(PROCESSED_IDS_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveProcessedIds(idSet) {
  try {
    // Keep only the most recent MAX_PROCESSED_IDS entries
    const arr = Array.from(idSet).slice(-MAX_PROCESSED_IDS);
    localStorage.setItem(PROCESSED_IDS_STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
}

// ─── Core Event Listener ──────────────────────────────────────────────────────

/**
 * Starts a Soroban contract event polling loop.
 *
 * @param {object} options
 * @param {function(parsedEvent): Promise<void>} options.onEvent
 *   Called exactly once per new event. Never called for duplicates.
 * @param {function(error): void}  [options.onError]
 *   Called when a non-fatal poll failure occurs.
 * @param {number} [options.startLedger]
 *   The ledger sequence to start polling from. If omitted, resumes from the
 *   stored cursor, or starts from the current latest ledger (live-only mode).
 *
 * @returns {function} stop — call this to stop the listener and clean up.
 */
export function startSorobanEventListener({ onEvent, onError, startLedger } = {}) {
  let stopped = false;
  let timer = null;
  let consecutiveFailures = 0;
  const processedIds = loadProcessedIds();

  // Cursor is either the stored cursor, or will be initialized from latest ledger
  let cursor = loadCursor();

  console.log(
    `[SorobanEvents] Starting event listener for contract ${SOROBAN_CONTRACT_ID}. ` +
    `Stored cursor: ${cursor || 'none'}`
  );

  async function poll() {
    if (stopped) return;

    try {
      let queryOptions;

      if (cursor) {
        // Continue from where we left off using paging cursor
        queryOptions = {
          filters: [
            {
              type: 'contract',
              contractIds: [SOROBAN_CONTRACT_ID],
            },
          ],
          cursor,
          limit: 20,
        };
      } else {
        // First run: no stored cursor, so determine the best start ledger.
        // We scan from CONTRACT_DEPLOY_LEDGER (not just latestLedger-10)
        // so that ALL historical events from this contract deployment are
        // detected on startup — including events that occurred before the
        // current browser session started.
        //
        // If the RPC rejects CONTRACT_DEPLOY_LEDGER as outside the retention
        // window, the error handler will catch and retry; in practice the
        // Testnet RPC retains events for ~7 days.
        let ledgerToStart = startLedger || CONTRACT_DEPLOY_LEDGER;

        // Clamp to within the RPC's retention window if we can
        try {
          const latest = await sorobanServer.getLatestLedger();
          // If the deploy ledger is more than 100k ledgers ago, start from
          // the oldest accessible ledger instead (100k ledger safety margin)
          const oldestSafe = Math.max(1, latest.sequence - 100_000);
          if (ledgerToStart < oldestSafe) {
            console.warn(
              `[SorobanEvents] CONTRACT_DEPLOY_LEDGER ${ledgerToStart} is outside ` +
              `the RPC retention window. Starting from ${oldestSafe}.`
            );
            ledgerToStart = oldestSafe;
          }
        } catch {
          // If we can't reach the RPC now, keep the deploy ledger as-is;
          // the poll() error handler will handle the retry.
        }

        queryOptions = {
          startLedger: ledgerToStart,
          filters: [
            {
              type: 'contract',
              contractIds: [SOROBAN_CONTRACT_ID],
            },
          ],
          limit: 50,
        };
      }

      const result = await sorobanServer.getEvents(queryOptions);
      consecutiveFailures = 0;

      const events = result.events || [];

      for (const rawEvent of events) {
        const eventId = rawEvent.id;

        // Deduplicate
        if (processedIds.has(eventId)) continue;

        // Only process events from successful contract calls
        if (rawEvent.inSuccessfulContractCall === false) {
          processedIds.add(eventId);
          continue;
        }

        const parsed = parseRentVaultEvent(rawEvent);
        if (parsed) {
          console.log(
            `[SorobanEvents] ✅ New event: ${parsed.type} | agreement=${parsed.agreementId} | tx=${parsed.txHash}`
          );
          processedIds.add(eventId);
          saveProcessedIds(processedIds);

          try {
            await onEvent(parsed);
          } catch (handlerErr) {
            console.error('[SorobanEvents] onEvent handler error:', handlerErr);
          }
        } else {
          // Still mark as processed so we don't re-examine it
          processedIds.add(eventId);
        }
      }

      // Update cursor to the last event's ID, or keep the current cursor
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        cursor = lastEvent.id;
        saveCursor(cursor);
      } else if (!cursor) {
        // No events returned on this poll, cursor is still null.
        // Keep startLedger-based polling on the next cycle — this is correct
        // because the next call will re-use CONTRACT_DEPLOY_LEDGER until
        // at least one event is found and a real cursor is established.
        // This avoids infinite re-scanning of very old ledgers: once a cursor
        // is saved, all subsequent polls use cursor-based paging.
      }

    } catch (err) {
      consecutiveFailures++;
      const errMsg = err?.message || String(err);
      console.warn(`[SorobanEvents] Poll failure #${consecutiveFailures}: ${errMsg}`);

      if (onError) {
        try { onError(err); } catch { /* ignore */ }
      }

      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(
          `[SorobanEvents] ${MAX_CONSECUTIVE_FAILURES} consecutive failures. ` +
          `Backing off for ${BACKOFF_INTERVAL_MS / 1000}s.`
        );
        if (!stopped) {
          timer = setTimeout(poll, BACKOFF_INTERVAL_MS);
        }
        return;
      }
    }

    // Schedule next poll
    if (!stopped) {
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    }
  }

  // Kick off immediately
  poll();

  // Return stop function
  return function stop() {
    stopped = true;
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    saveProcessedIds(processedIds);
    console.log('[SorobanEvents] Listener stopped.');
  };
}

/**
 * One-shot: fetch all historical events from the deployed contract
 * starting from a given ledger. Useful for backfilling agreement state
 * after a page refresh.
 *
 * @param {number} fromLedger
 * @returns {Promise<Array>} Parsed RentVault events (may be empty)
 */
export async function fetchHistoricalEvents(fromLedger) {
  try {
    const result = await sorobanServer.getEvents({
      startLedger: fromLedger,
      filters: [
        {
          type: 'contract',
          contractIds: [SOROBAN_CONTRACT_ID],
        },
      ],
      limit: 200,
    });

    const events = result.events || [];
    const parsed = [];

    for (const rawEvent of events) {
      if (rawEvent.inSuccessfulContractCall === false) continue;
      const p = parseRentVaultEvent(rawEvent);
      if (p) parsed.push(p);
    }

    console.log(`[SorobanEvents] Fetched ${parsed.length} historical events from ledger ${fromLedger}`);
    return parsed;
  } catch (err) {
    console.error('[SorobanEvents] fetchHistoricalEvents error:', err);
    return [];
  }
}

/**
 * Clears the locally stored cursor and processed-ID dedup set.
 * Use this if you want the listener to re-scan from scratch.
 *
 * Callable from browser DevTools console:
 *   window.resetSorobanCursor()
 */
export function resetEventCursor() {
  try {
    localStorage.removeItem(CURSOR_STORAGE_KEY);
    localStorage.removeItem(PROCESSED_IDS_STORAGE_KEY);
    console.log('[SorobanEvents] Cursor and processed-ID set cleared. Reload the page to re-scan from CONTRACT_DEPLOY_LEDGER.');
  } catch {
    // ignore
  }
}

// Expose to browser window for convenient DevTools testing.
// Usage in console: window.resetSorobanCursor()
if (typeof window !== 'undefined') {
  window.resetSorobanCursor = resetEventCursor;
}
