import { API_URL } from './config';

export async function getZones() {
  const res = await fetch(`${API_URL}/api/zones`);
  if (!res.ok) throw new Error('Failed to fetch zones');
  return res.json();
}

export async function getAlerts() {
  const res = await fetch(`${API_URL}/api/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function getSummary() {
  const res = await fetch(`${API_URL}/api/analytics/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function postAlert(payload) {
  const res = await fetch(`${API_URL}/api/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create alert');
  }
  return res.json();
}
