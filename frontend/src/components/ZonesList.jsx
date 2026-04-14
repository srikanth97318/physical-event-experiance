import { Progress } from '@mantine/core';
import { IconBuilding, IconUsers, IconClock } from '@tabler/icons-react';
import { motion } from 'framer-motion';

function getLevelClass(level) {
  if (level === 'High') return 'high';
  if (level === 'Medium') return 'medium';
  return 'low';
}

function getOccupancyColor(occupancy, capacity) {
  const ratio = occupancy / capacity;
  if (ratio > 0.9) return '#ef4444';
  if (ratio > 0.7) return '#fbbf24';
  return '#4ade80';
}

export default function ZonesList({ zones }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="panel"
    >
      <h3 style={{ marginBottom: '20px' }}>
        <IconBuilding size={24} style={{ color: '#818cf8' }} />
        Venue Zones Overview
      </h3>

      <div className="zones-list">
        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
            className="zone-card"
          >
            <div className="zone-card-top">
              <div>
                <h3>{zone.name}</h3>
                <p>{zone.type}</p>
              </div>
              <div className={`badge ${getLevelClass(zone.level)}`}>
                {zone.level}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Occupancy</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  {zone.occupancy} <span style={{ color: '#64748b', fontWeight: 400 }}>/ {zone.capacity}</span>
                </span>
              </div>
              <Progress
                value={(zone.occupancy / zone.capacity) * 100}
                color={getOccupancyColor(zone.occupancy, zone.capacity)}
                size="md"
                radius="xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            <div className="zone-metrics">
              <span>
                <IconUsers size={16} />
                <strong>{zone.queueLength}</strong> Queue
              </span>
              <span>
                <IconClock size={16} />
                <strong>{zone.estimatedWaitMinutes}m</strong> Wait
              </span>
              <span>
                <div style={{ fontSize: '0.75rem', marginTop: 'auto', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <strong style={{ color: zone.isActive ? '#4ade80' : '#fca5a5', fontSize: '0.9rem' }}>
                  {zone.isActive !== false ? 'Active' : 'Closed'}
                </strong>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
