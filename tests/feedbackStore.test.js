import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getFeedbackMetrics } from '../src/services/feedbackStore.js';

describe('User Feedback Store & Analytics Tests', () => {
  it('should return safe zeroed metrics for empty feedback submissions', () => {
    const metrics = getFeedbackMetrics([]);
    assert.strictEqual(metrics.totalCount, 0);
    assert.strictEqual(metrics.averageRating, 0);
    assert.strictEqual(metrics.averageEaseOfUse, 0);
    assert.strictEqual(metrics.csatScore, 0);
    assert.deepStrictEqual(metrics.statusCounts, { PENDING_REVIEW: 0, IN_PROGRESS: 0, RESOLVED: 0 });
    assert.deepStrictEqual(metrics.priorityCounts, { HIGH: 0, MEDIUM: 0, LOW: 0 });
  });

  it('should accurately calculate average rating, ease-of-use, and CSAT score', () => {
    const mockFeedbacks = [
      { id: 'fb-1', rating: 5, easeOfUse: 5, category: 'UX & Interface', status: 'RESOLVED', priority: 'LOW' },
      { id: 'fb-2', rating: 4, easeOfUse: 4, category: 'Escrow Speed', status: 'IN_PROGRESS', priority: 'MEDIUM' },
      { id: 'fb-3', rating: 3, easeOfUse: 2, category: 'Wallet Onboarding', status: 'PENDING_REVIEW', priority: 'HIGH' },
      { id: 'fb-4', rating: 5, easeOfUse: 5, category: 'UX & Interface', status: 'RESOLVED', priority: 'LOW' },
    ];

    const metrics = getFeedbackMetrics(mockFeedbacks);
    assert.strictEqual(metrics.totalCount, 4);
    // Average rating: (5 + 4 + 3 + 5) / 4 = 17 / 4 = 4.25 -> 4.3 (toFixed(1))
    assert.strictEqual(metrics.averageRating, 4.3);
    // Average ease: (5 + 4 + 2 + 5) / 4 = 16 / 4 = 4.0
    assert.strictEqual(metrics.averageEaseOfUse, 4.0);
    // CSAT: (3 items >= 4) / 4 = 75%
    assert.strictEqual(metrics.csatScore, 75);

    // Status counts
    assert.strictEqual(metrics.statusCounts.RESOLVED, 2);
    assert.strictEqual(metrics.statusCounts.IN_PROGRESS, 1);
    assert.strictEqual(metrics.statusCounts.PENDING_REVIEW, 1);

    // Category counts
    assert.strictEqual(metrics.categoryCounts['UX & Interface'], 2);
    assert.strictEqual(metrics.categoryCounts['Escrow Speed'], 1);
    assert.strictEqual(metrics.categoryCounts['Wallet Onboarding'], 1);

    // Priority counts
    assert.strictEqual(metrics.priorityCounts.HIGH, 1);
    assert.strictEqual(metrics.priorityCounts.MEDIUM, 1);
    assert.strictEqual(metrics.priorityCounts.LOW, 2);
  });

  it('should handle missing ease-of-use gracefully by falling back to rating', () => {
    const legacyFeedback = [
      { id: 'fb-legacy', rating: 4, category: 'General' },
    ];
    const metrics = getFeedbackMetrics(legacyFeedback);
    assert.strictEqual(metrics.averageRating, 4.0);
    assert.strictEqual(metrics.averageEaseOfUse, 4.0);
    assert.strictEqual(metrics.statusCounts.PENDING_REVIEW, 1);
  });
});
