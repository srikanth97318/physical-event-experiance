import { state } from './store/state.js';

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.emit('bootstrap', {
      me: socket.id,
      zones: state.getZonePayload(),
      alerts: state.alerts,
      attendees: state.getAttendeePayload(),
      summary: state.getSummary()
    });

    socket.on('location:update', (payload) => {
      if (!payload || typeof payload.lat !== 'number' || typeof payload.lng !== 'number') {
        return;
      }
      const attendee = state.upsertAttendee(socket.id, payload);
      io.emit('attendee:updated', attendee);
      io.emit('zones:updated', state.getZonePayload());
      io.emit('summary:updated', state.getSummary());
    });

    socket.on('panic:alert', (payload = {}) => {
      const attendee = state.attendees.get(socket.id);
      const alert = state.addAlert({
        message: payload.message || 'Emergency assistance requested by attendee',
        severity: 'critical',
        source: socket.id,
        zoneId: attendee?.zoneId || null
      });
      io.emit('alert:new', alert);
    });

    socket.on('admin:broadcast', (payload = {}) => {
      if (!payload.message) return;
      const alert = state.addAlert({
        message: payload.message,
        severity: payload.severity || 'info',
        source: 'admin',
        zoneId: payload.zoneId || null
      });
      io.emit('alert:new', alert);
    });

    socket.on('disconnect', () => {
      state.removeAttendee(socket.id);
      io.emit('attendee:removed', { socketId: socket.id });
      io.emit('zones:updated', state.getZonePayload());
      io.emit('summary:updated', state.getSummary());
    });
  });
}
