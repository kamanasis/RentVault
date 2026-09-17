/**
 * analytics.js
 * Privacy-preserving, non-blocking application analytics service for RentVault.
 * 
 * Guarantees:
 * 1. Zero-throw execution: Analytics failures will never interrupt or block financial/contract logic.
 * 2. Privacy-first: Strips any secret keys (Stellar 'S...'), passwords, or sensitive credentials.
 * 3. Session-isolated: Buffered in-memory and sessionStorage without persistent cross-site tracking.
 */

const STORAGE_KEY = 'rentvault_analytics_events_v1';
const MAX_BUFFERED_EVENTS = 100;

// In-memory events ring buffer
let eventsBuffer = [];

// Initialize buffer from sessionStorage if available
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        eventsBuffer = parsed.slice(-MAX_BUFFERED_EVENTS);
      }
    }
  }
} catch {
  // Silent fallback
}

/**
 * Sanitizes event properties to ensure no private keys or credentials leak.
 */
export function sanitizeAnalyticsProperties(props = {}) {
  if (!props || typeof props !== 'object') return {};

  const clean = {};
  for (const [key, value] of Object.entries(props)) {
    // Exclude keys named secret, private, password, credential, seed
    if (/secret|private|seed|password|key.*sec/i.test(key)) {
      continue;
    }

    if (typeof value === 'string') {
      // Scrub Stellar secret keys (starts with S and 56 alphanumeric chars)
      const scrubbed = value.replace(/S[A-Z0-9]{55}/g, '[REDACTED_SECRET_KEY]');
      clean[key] = scrubbed;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else if (value === null || value === undefined) {
      clean[key] = value;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      clean[key] = sanitizeAnalyticsProperties(value);
    } else {
      clean[key] = String(value);
    }
  }
  return clean;
}

/**
 * Dispatches an analytics event.
 * Always returns a boolean and NEVER throws an exception.
 */
export function trackEvent(eventName, properties = {}) {
  try {
    if (!eventName || typeof eventName !== 'string') {
      return false;
    }

    const event = {
      name: eventName,
      properties: sanitizeAnalyticsProperties(properties),
      timestamp: new Date().toISOString(),
    };

    eventsBuffer.push(event);
    if (eventsBuffer.length > MAX_BUFFERED_EVENTS) {
      eventsBuffer.shift();
    }

    // Persist to sessionStorage for current session inspection
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(eventsBuffer));
      } catch {
        // Storage quota exceeded or disabled; keep in-memory only
      }
    }

    return true;
  } catch (err) {
    // Non-blocking: analytics failure must never impact the application
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Analytics Service] Failed to record event:', err);
    }
    return false;
  }
}

/**
 * Retrieves the most recent analytics events.
 */
export function getRecentEvents(limit = 20) {
  try {
    return [...eventsBuffer].reverse().slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Computes aggregated counts of tracked events.
 */
export function getEventCounts() {
  try {
    const counts = {};
    for (const ev of eventsBuffer) {
      counts[ev.name] = (counts[ev.name] || 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

/**
 * Summarizes application analytics for observability dashboards.
 */
export function getAnalyticsSummary() {
  try {
    const counts = getEventCounts();
    return {
      totalEvents: eventsBuffer.length,
      walletConnects: counts['wallet_connected'] || 0,
      agreementsCreated: counts['agreement_created'] || 0,
      depositsStarted: counts['deposit_started'] || 0,
      depositsConfirmed: counts['deposit_confirmed'] || 0,
      leasesActivated: counts['lease_activated'] || 0,
      settlementsApproved: counts['settlement_approved'] || 0,
      refundsConfirmed: counts['refund_confirmed'] || 0,
      actionErrors: counts['user_action_failed'] || 0,
      eventCounts: counts,
    };
  } catch {
    return {
      totalEvents: 0,
      walletConnects: 0,
      agreementsCreated: 0,
      depositsStarted: 0,
      depositsConfirmed: 0,
      leasesActivated: 0,
      settlementsApproved: 0,
      refundsConfirmed: 0,
      actionErrors: 0,
      eventCounts: {},
    };
  }
}

/**
 * Clears the session analytics buffer.
 */
export function clearAnalytics() {
  eventsBuffer = [];
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}
