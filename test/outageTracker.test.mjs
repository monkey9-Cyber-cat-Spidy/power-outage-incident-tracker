import { test, describe } from 'node:test';
import assert from 'node:assert';
import { OutageTracker } from '../src/outageTracker.mjs';

describe('Power Outage Incident Tracker Suite', () => {
  const tracker = new OutageTracker();

  test('should report and progress an incident through valid state transitions', () => {
    const inc = tracker.reportOutage({ feederId: 'FDR-44', substationId: 'SUB-NORTH', affectedCustomers: 1200 });
    assert.strictEqual(inc.status, 'LOGGED');
    assert.strictEqual(inc.affectedCustomers, 1200);

    const step1 = tracker.transitionStatus(inc.id, 'INVESTIGATING', 'Field team assigned');
    assert.strictEqual(step1.status, 'INVESTIGATING');

    const step2 = tracker.transitionStatus(inc.id, 'CREW_DISPATCHED', 'Vehicle #14 on route');
    assert.strictEqual(step2.status, 'CREW_DISPATCHED');
  });

  test('should reject invalid state transitions', () => {
    const inc = tracker.reportOutage({ feederId: 'FDR-12', substationId: 'SUB-EAST', affectedCustomers: 50 });
    assert.throws(() => {
      tracker.transitionStatus(inc.id, 'POWER_RESTORED');
    }, /Invalid state transition/);
  });
});
