import { IconBell, IconInfoCircle, IconAlertTriangle, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

function getSeverityClass(severity) {
  switch (severity) {
    case 'critical': return 'critical';
    case 'warning': return 'warning';
    case 'info': return 'info';
    default: return 'info';
  }
}

function getSeverityIcon(severity) {
  switch (severity) {
    case 'critical': return <IconX size={16} />;
    case 'warning': return <IconAlertTriangle size={16} />;
    case 'info': return <IconInfoCircle size={16} />;
    default: return <IconBell size={16} />;
  }
}

export default function AlertsPanel({ alerts }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="panel"
    >
      <h3 style={{ marginBottom: '20px', color: '#f1f5f9' }}>
        <IconBell size={24} style={{ color: '#818cf8' }} />
        Live Alerts
      </h3>

      <div className="alerts-list">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}
            >
              No active alerts.
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`alert-item ${getSeverityClass(alert.severity)}`}
              >
                <div className="alert-head">
                  <span className={`badge ${getSeverityClass(alert.severity)}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    {getSeverityIcon(alert.severity)} {alert.severity || 'INFO'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <p style={{ margin: '8px 0', fontSize: '0.95rem', fontWeight: 500 }}>
                  {alert.message}
                </p>

                <div className="alert-meta">
                  <span>Source: {alert.source}</span>
                  {alert.zoneId && <span>&bull; Zone: {alert.zoneId}</span>}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
