import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App.jsx';
import 'leaflet/dist/leaflet.css';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider
      forceColorScheme="dark"
      theme={{
        colors: {
          brand: [
            '#f2f0ff',
            '#e0dff2',
            '#bfbae6',
            '#9b92da',
            '#7d72d1',
            '#685bc9',
            '#5c4ec6',
            '#4c3fb0',
            '#43389d',
            '#3a2f8b',
          ],
        },
        primaryColor: 'brand',
        fontFamily: 'Inter, system-ui, sans-serif',
        defaultRadius: 'lg',
        components: {
          Card: {
            defaultProps: {
              radius: 'xl',
            },
          },
          Paper: {
            defaultProps: {
              radius: 'xl',
            },
          },
          Button: {
            defaultProps: {
              radius: 'xl',
            },
          },
        },
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
