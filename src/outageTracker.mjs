export class OutageTracker {
  constructor() {
    this.incidents = new Map();
  }

  reportOutage({ feederId, substationId, affectedCustomers, reportedBy }) {
    const id = `INC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const incident = {
      id,
      feederId,
      substationId,
      affectedCustomers: affectedCustomers || 0,
      reportedBy,
      status: 'LOGGED',
      createdAt: new Date().toISOString(),
      timeline: [{ status: 'LOGGED', timestamp: new Date().toISOString() }]
    };
    this.incidents.set(id, incident);
    return incident;
  }

  transitionStatus(id, newStatus, notes) {
    const incident = this.incidents.get(id);
    if (!incident) throw new Error(`Incident ${id} not found`);

    const validTransitions = {
      LOGGED: ['INVESTIGATING', 'CANCELLED'],
      INVESTIGATING: ['CREW_DISPATCHED', 'RESOLVED'],
      CREW_DISPATCHED: ['WORK_IN_PROGRESS'],
      WORK_IN_PROGRESS: ['POWER_RESTORED'],
      POWER_RESTORED: ['CLOSED']
    };

    if (!validTransitions[incident.status]?.includes(newStatus)) {
      throw new Error(`Invalid state transition from ${incident.status} to ${newStatus}`);
    }

    incident.status = newStatus;
    incident.timeline.push({ status: newStatus, timestamp: new Date().toISOString(), notes });
    return incident;
  }

  getActiveOutagesCount() {
    return Array.from(this.incidents.values()).filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED').length;
  }
}
