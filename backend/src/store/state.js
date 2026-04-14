import { zones } from '../config/zones.js';
import { getZoneForPoint } from '../utils/geo.js';

class SmartCrowdState {
  constructor() {
    this.attendees = new Map();
    this.alerts = [];
    this.zoneStats = new Map();
    this.seedQueueStats();
  }

  seedQueueStats() {
    zones.forEach((zone) => {
      this.zoneStats.set(zone.id, {
        zoneId: zone.id,
        queueLength: 0,
        estimatedWaitMinutes: 0,
        occupancy: 0,
        level: 'Low'
      });
    });
  }

  upsertAttendee(socketId, payload) {
    const { lat, lng, accuracy = null, speed = null, heading = null, timestamp = Date.now() } = payload;
    const zone = getZoneForPoint(lat, lng, zones);
    const next = {
      socketId,
      lat,
      lng,
      accuracy,
      speed,
      heading,
      timestamp,
      zoneId: zone?.id || null
    };
    this.attendees.set(socketId, next);
    this.recomputeZoneMetrics();
    return next;
  }

  removeAttendee(socketId) {
    this.attendees.delete(socketId);
    this.recomputeZoneMetrics();
  }

  addAlert(alert) {
    const item = {
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      severity: alert.severity || 'info',
      message: alert.message,
      source: alert.source || 'system',
      zoneId: alert.zoneId || null
    };
    this.alerts.unshift(item);
    this.alerts = this.alerts.slice(0, 50);
    return item;
  }

  recomputeZoneMetrics() {
    const occupancyMap = new Map(zones.map((z) => [z.id, 0]));

    for (const attendee of this.attendees.values()) {
      if (attendee.zoneId && occupancyMap.has(attendee.zoneId)) {
        occupancyMap.set(attendee.zoneId, occupancyMap.get(attendee.zoneId) + 1);
      }
    }

    zones.forEach((zone) => {
      const occupancy = occupancyMap.get(zone.id) || 0;
      const ratio = occupancy / zone.capacity;
      let level = 'Low';
      if (ratio >= 0.7) level = 'High';
      else if (ratio >= 0.35) level = 'Medium';

      // Lightweight queue simulation based on occupancy and zone type
      const queueFactor = zone.type === 'entry' ? 0.35 : zone.type === 'food' ? 0.6 : zone.type === 'facility' ? 0.45 : 0.15;
      const queueLength = Math.max(0, Math.round(occupancy * queueFactor));
      const estimatedWaitMinutes = Math.max(0, Math.round(queueLength / 6));

      this.zoneStats.set(zone.id, {
        zoneId: zone.id,
        queueLength,
        estimatedWaitMinutes,
        occupancy,
        level
      });
    });
  }

  getZonePayload() {
    return zones.map((zone) => ({
      ...zone,
      ...this.zoneStats.get(zone.id)
    }));
  }

  getAttendeePayload() {
    return Array.from(this.attendees.values()).map((a) => ({
      socketId: a.socketId,
      lat: a.lat,
      lng: a.lng,
      accuracy: a.accuracy,
      speed: a.speed,
      heading: a.heading,
      timestamp: a.timestamp,
      zoneId: a.zoneId
    }));
  }

  getSummary() {
    const zonePayload = this.getZonePayload();
    const totalAttendees = this.attendees.size;
    const hotZones = zonePayload.filter((z) => z.level === 'High').length;
    const totalQueue = zonePayload.reduce((sum, z) => sum + z.queueLength, 0);
    return {
      totalAttendees,
      hotZones,
      totalQueue,
      alertsCount: this.alerts.length,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const state = new SmartCrowdState();
