import { useState } from 'react';
import { IconLocation, IconBroadcast, IconAlertTriangle, IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { socket } from '../lib/socket';

export default function ControlPanel({ geo }) {
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [panicLoading, setPanicLoading] = useState(false);

  const sendBroadcast = () => {
    if (!message.trim()) return;
    socket.emit('admin:broadcast', { message: message.trim(), severity });
    setMessage('');
  };

  const panic = () => {
    setPanicLoading(true);
    socket.emit('panic:alert', { message: 'Emergency assistance required at my live location' });
    setTimeout(() => setPanicLoading(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="panel"
      style={{ marginBottom: '24px' }}
    >
      <h3 style={{ marginBottom: '24px', color: '#f1f5f9' }}>
        <IconLocation size={24} style={{ color: '#818cf8' }}/>
        Location & Controls
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="button-row">
          {!geo.isTracking ? (
            <button className="btn primary" onClick={geo.startTracking} style={{ flex: 1, justifyContent: 'center' }}>
              <IconPlayerPlay size={18} /> Start Live Tracking
            </button>
          ) : (
            <button className="btn" onClick={geo.stopTracking} style={{ flex: 1, justifyContent: 'center' }}>
              <IconPlayerPause size={18} /> Stop Tracking
            </button>
          )}
          <button className="btn danger" onClick={panic} disabled={panicLoading} style={{ flex: 1, justifyContent: 'center' }}>
            <IconAlertTriangle size={18} /> {panicLoading ? 'Alert Sent...' : 'Emergency Alert'}
          </button>
        </div>

        {geo.permissionError && (
          <div className="alert-item error" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px' }}>
            {geo.permissionError}
          </div>
        )}

        {geo.position && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="location-meta"
          >
            <span><strong>Lat:</strong> {geo.position.lat.toFixed(6)}</span>
            <span><strong>Lng:</strong> {geo.position.lng.toFixed(6)}</span>
            <span><strong>Acc:</strong> {Math.round(geo.position.accuracy || 0)}m</span>
          </motion.div>
        )}

        <hr />

        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
            <IconBroadcast size={20} style={{ color: '#818cf8' }}/>
            Admin Broadcast
          </h3>

          <div className="field">
            <label>Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="field">
            <label>Message</label>
            <textarea
              placeholder="Example: Gate A is congested. Please use Gate B."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <button 
            className="btn primary" 
            onClick={sendBroadcast} 
            disabled={!message.trim()} 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <IconBroadcast size={18} /> Send Live Alert
          </button>
        </div>
      </div>
    </motion.div>
  );
}
