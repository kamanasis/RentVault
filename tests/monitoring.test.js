import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { 
  captureError, 
  captureRpcFailure, 
  sanitizeTelemetryPayload, 
  getMonitoringIncidents, 
  getMonitoringStats, 
  clearMonitoringIncidents 
} from '../src/services/monitoring.js';

describe('Production Error Monitoring & Telemetry Tests', () => {
  beforeEach(() => {
    clearMonitoringIncidents();
  });

  it('should capture runtime errors and store sanitized incidents', () => {
    const error = new Error('Simulation failed on Soroban RPC');
    const id = captureError(error, { operation: 'depositEscrowContract' });

    assert.ok(id && id.startsWith('err-'));

    const incidents = getMonitoringIncidents();
    assert.strictEqual(incidents.length, 1);
    assert.strictEqual(incidents[0].type, 'Error');
    assert.strictEqual(incidents[0].message, 'Simulation failed on Soroban RPC');
    assert.strictEqual(incidents[0].context.operation, 'depositEscrowContract');
  });

  it('should redact secret keys and credentials in error messages and context', () => {
    const rawSecret = 'SB3YAY734VGBLC4B3KGCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHAAA';
    const dirtyError = new Error(`Transaction failed for ${rawSecret} and token=abc123xyz`);

    captureError(dirtyError, {
      endpoint: 'https://soroban-testnet.stellar.org',
      privateNote: 'Should be redacted',
    });

    const incidents = getMonitoringIncidents();
    assert.strictEqual(incidents.length, 1);
    assert.strictEqual(incidents[0].message.includes(rawSecret), false);
    assert.ok(incidents[0].message.includes('[REDACTED_SECRET_KEY]'));
    assert.ok(incidents[0].message.includes('token=[REDACTED]'));
    assert.strictEqual(incidents[0].context.privateNote, '[REDACTED]');
  });

  it('should capture RPC network failure incidents with category RPC_NETWORK_FAILURE', () => {
    captureRpcFailure('Horizon', 'https://horizon-testnet.stellar.org/accounts', new Error('Gateway Timeout 504'));

    const stats = getMonitoringStats();
    assert.strictEqual(stats.totalIncidents, 1);
    assert.strictEqual(stats.byCategory['RPC_NETWORK_FAILURE'], 1);
  });

  it('should never throw when invalid or circular error objects are passed', () => {
    const circular = {};
    circular.self = circular;

    const id1 = captureError(circular);
    const id2 = captureError(null);
    const id3 = captureError(undefined);

    assert.ok(id1);
    assert.ok(id2);
    assert.ok(id3);
  });
});
