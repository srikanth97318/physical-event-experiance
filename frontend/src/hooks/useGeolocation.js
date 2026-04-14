import { useEffect, useRef, useState } from 'react';
import { socket } from '../lib/socket';

export function useGeolocation() {
  const [isTracking, setIsTracking] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [position, setPosition] = useState(null);
  const watcherRef = useRef(null);

  const stopTracking = () => {
    if (watcherRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watcherRef.current);
      watcherRef.current = null;
    }
    setIsTracking(false);
  };

  const startTracking = () => {
    setPermissionError('');
    if (!('geolocation' in navigator)) {
      setPermissionError('Geolocation is not supported in this browser.');
      return;
    }

    watcherRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp
        };
        setPosition(payload);
        socket.emit('location:update', payload);
        setIsTracking(true);
      },
      (err) => {
        setPermissionError(err.message || 'Failed to access location');
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );
  };

  useEffect(() => () => stopTracking(), []);

  return {
    isTracking,
    permissionError,
    position,
    startTracking,
    stopTracking
  };
}
