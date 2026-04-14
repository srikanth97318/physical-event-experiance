import { useEffect, useMemo, useState } from 'react';
import { Container, Grid, Paper, Badge, Group, Text } from '@mantine/core';
import { IconWifi, IconWifiOff } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { getAlerts, getSummary, getZones } from './api';
import { socket } from './lib/socket';
import { useGeolocation } from './hooks/useGeolocation';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ZonesList from './components/ZonesList';
import AlertsPanel from './components/AlertsPanel';
import VenueMap from './components/VenueMap';

const DEFAULT_CENTER = [12.9279, 77.6271];

export default function App() {
  const geo = useGeolocation();
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [summary, setSummary] = useState({});
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    Promise.all([getZones(), getAlerts(), getSummary()])
      .then(([zoneData, alertData, summaryData]) => {
        setZones(zoneData);
        setAlerts(alertData);
        setSummary(summaryData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const onBootstrap = (payload) => {
      setSocketId(payload.me);
      setZones(payload.zones || []);
      setAlerts(payload.alerts || []);
      setAttendees(payload.attendees || []);
      setSummary(payload.summary || {});
    };
    const onZones = (payload) => setZones(payload);
    const onSummary = (payload) => setSummary(payload);
    const onAlert = (payload) => setAlerts((prev) => [payload, ...prev]);
    const onAttendeeUpdated = (payload) => {
      setAttendees((prev) => {
        const index = prev.findIndex((p) => p.socketId === payload.socketId);
        if (index === -1) return [...prev, payload];
        const next = [...prev];
        next[index] = payload;
        return next;
      });
    };
    const onAttendeeRemoved = ({ socketId }) => {
      setAttendees((prev) => prev.filter((p) => p.socketId !== socketId));
    };

    socket.on('bootstrap', onBootstrap);
    socket.on('zones:updated', onZones);
    socket.on('summary:updated', onSummary);
    socket.on('alert:new', onAlert);
    socket.on('attendee:updated', onAttendeeUpdated);
    socket.on('attendee:removed', onAttendeeRemoved);

    return () => {
      socket.off('bootstrap', onBootstrap);
      socket.off('zones:updated', onZones);
      socket.off('summary:updated', onSummary);
      socket.off('alert:new', onAlert);
      socket.off('attendee:updated', onAttendeeUpdated);
      socket.off('attendee:removed', onAttendeeRemoved);
    };
  }, []);

  const center = useMemo(() => {
    if (geo.position) return [geo.position.lat, geo.position.lng];
    return DEFAULT_CENTER;
  }, [geo.position]);

  return (
    <div className="app-shell">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Header summary={summary} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="subbar">
            <Group spacing="xs">
              {socket.connected ? (
                <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '6px', borderRadius: '50%' }}>
                  <IconWifi size={20} color="#4ade80" />
                </div>
              ) : (
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '6px', borderRadius: '50%' }}>
                  <IconWifiOff size={20} color="#fca5a5" />
                </div>
              )}
              <Text size="sm" color="#cbd5e1" weight={500}>
                Network Status:{' '}
                <span style={{ color: socket.connected ? '#4ade80' : '#fca5a5', fontWeight: 600 }}>
                  {socket.connected ? 'Live & Connected' : 'Connecting to Server...'}
                </span>
              </Text>
            </Group>
            <Text size="sm" color="#cbd5e1">
              Active Session:{' '}
              <Badge variant="outline" color="indigo" radius="md">
                {socketId || 'Pending'}
              </Badge>
            </Text>
          </div>
        </motion.div>

        <div className="layout-grid">
          <div className="main-column">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="panel map-panel"
            >
              <h3>Event Operations Map</h3>
              <VenueMap center={center} zones={zones} attendees={attendees} myPosition={geo.position} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <ZonesList zones={zones} />
            </motion.div>
          </div>

          <div className="sidebar-column">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <ControlPanel geo={geo} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <AlertsPanel alerts={alerts} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
