/**
 * monitoring.js
 * Production-ready application monitoring & error telemetry service for RentVault.
 * 
 * Responsibilities:
 * 1. Captures runtime exceptions, unhandled Promise rejections, and RPC timeouts.
 * 2. Strict sanitization: Redacts Stellar secret keys ('S...'), seed phrases, and auth tokens.
 * 3. Non-blocking: Monitoring failures will never bubble up or interfere with contract execution.
 */

const MONITORING_STORAGE_KEY = 'rentvault_monitoring_incidents_v1';
const MAX_INCIDENTS = 50;

let incidentBuffer = [];

// Initialize buffer from sessionStorage if available
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const raw = window.sessionStorage.getItem(MONITORING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        incidentBuffer = parsed.slice(-MAX_INCIDENTS);
      }
    }
  }
} catch {
  // Silent fallback
}

/**
 * Sanitizes strings, objects, and stack traces to redact secrets.
 */
export function sanitizeTelemetryPayload(data) {
  if (!data) return data;

  if (typeof data === 'string') {
    return data
      .replace(/S[A-Z0-9]{55}/g, '[REDACTED_SECRET_KEY]')
      .replace(/(?:key|secret|password|auth|token)=([^\s&]+)/gi, (match) => {
        const keyName = match.split('=')[0];
        return `${keyName}=[REDACTED]`;
      });
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map((item) => sanitizeTelemetryPayload(item));
    }
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (/secret|private|seed|password|token|auth/i.test(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeTelemetryPayload(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Records an error incident with sanitized context.
 */
export function captureError(error, context = {}) {
  try {
    const message = error instanceof Error ? error.message : String(error || 'Unknown error');
    const stack = error instanceof Error ? error.stack : undefined;
    const name = error instanceof Error ? error.name : 'Error';

    const incident = {
      id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      type: name,
      message: sanitizeTelemetryPayload(message),
      stack: stack ? sanitizeTelemetryPayload(stack.slice(0, 1000)) : null,
      context: sanitizeTelemetryPayload(context),
      route: typeof window !== 'undefined' ? window.location.pathname : '',
    };

    incidentBuffer.push(incident);
    if (incidentBuffer.length > MAX_INCIDENTS) {
      incidentBuffer.shift();
    }

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(MONITORING_STORAGE_KEY, JSON.stringify(incidentBuffer));
      } catch {
        // Storage quota exceeded or disabled
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Monitoring Telemetry Captured]:', incident.message, incident.context);
    }

    return incident.id;
  } catch {
    // Non-blocking: fail silently to protect user experience
    return null;
  }
}

/**
 * Captures RPC or Network failure incidents (Horizon / Soroban / Firebase).
 */
export function captureRpcFailure(serviceName, endpoint, error, metadata = {}) {
  return captureError(error, {
    category: 'RPC_NETWORK_FAILURE',
    service: serviceName,
    endpoint: sanitizeTelemetryPayload(endpoint),
    ...metadata,
  });
}

/**
 * Retrieves the recorded incident history.
 */
export function getMonitoringIncidents(limit = 20) {
  try {
    return [...incidentBuffer].reverse().slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Returns aggregated statistics for the telemetry dashboard.
 */
export function getMonitoringStats() {
  try {
    const total = incidentBuffer.length;
    const byType = {};
    const byCategory = {};

    for (const inc of incidentBuffer) {
      byType[inc.type] = (byType[inc.type] || 0) + 1;
      const cat = inc.context?.category || 'RUNTIME_ERROR';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }

    return {
      totalIncidents: total,
      byType,
      byCategory,
      lastIncidentTime: incidentBuffer.length > 0 ? incidentBuffer[incidentBuffer.length - 1].timestamp : null,
    };
  } catch {
    return {
      totalIncidents: 0,
      byType: {},
      byCategory: {},
      lastIncidentTime: null,
    };
  }
}

/**
 * Clears the recorded incident history.
 */
export function clearMonitoringIncidents() {
  incidentBuffer = [];
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(MONITORING_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}

let isInitialized = false;

/**
 * Attaches global window error and unhandled rejection listeners.
 */
export function initGlobalErrorListeners() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  window.addEventListener('error', (event) => {
    captureError(event.error || event.message, {
      category: 'UNHANDLED_EXCEPTION',
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureError(event.reason || 'Unhandled Promise Rejection', {
      category: 'UNHANDLED_REJECTION',
    });
  });
}
