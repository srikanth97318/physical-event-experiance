import { Group, Title, Text, Card } from '@mantine/core';
import { IconUsers, IconFlame, IconClock } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export default function Header({ summary }) {
  return (
    <motion.header
      className="app-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Group position="apart" align="center" style={{ width: '100%' }}>
        <div>
          <Title order={1} size="2.4rem" weight={700} style={{ margin: 0 }}>
            SmartCrowd
          </Title>
          <Text size="md" color="dimmed" mt={6}>
            Real-time event experience platform for attendees and organizers
          </Text>
        </div>
        <Group spacing="lg">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="header-stat-card">
              <Group spacing="sm" noWrap>
                <div className="stat-icon">
                  <IconUsers size={24} stroke={2} />
                </div>
                <div>
                  <Text size="xs" color="#94a3b8" transform="uppercase" weight={600} letterSpacing="0.05em">Attendees</Text>
                  <Text weight={800} size="xl" color="#f8fafc" style={{ lineHeight: 1, marginTop: 4 }}>
                    {summary.totalAttendees ?? 0}
                  </Text>
                </div>
              </Group>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="header-stat-card">
              <Group spacing="sm" noWrap>
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                  <IconFlame size={24} stroke={2} />
                </div>
                <div>
                  <Text size="xs" color="#94a3b8" transform="uppercase" weight={600} letterSpacing="0.05em">Hot Zones</Text>
                  <Text weight={800} size="xl" color="#f8fafc" style={{ lineHeight: 1, marginTop: 4 }}>
                    {summary.hotZones ?? 0}
                  </Text>
                </div>
              </Group>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="header-stat-card">
              <Group spacing="sm" noWrap>
                <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <IconClock size={24} stroke={2} />
                </div>
                <div>
                  <Text size="xs" color="#94a3b8" transform="uppercase" weight={600} letterSpacing="0.05em">Total Queue</Text>
                  <Text weight={800} size="xl" color="#f8fafc" style={{ lineHeight: 1, marginTop: 4 }}>
                    {summary.totalQueue ?? 0}
                  </Text>
                </div>
              </Group>
            </Card>
          </motion.div>
        </Group>
      </Group>
    </motion.header>
  );
}
