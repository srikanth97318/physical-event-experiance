export const VENUE_CENTER = [12.9279, 77.6271];

// Rectangular geofence zones for MVP.
// Format: [minLat, minLng, maxLat, maxLng]
export const zones = [
  {
    id: 'gate-a',
    name: 'Gate A',
    type: 'entry',
    bbox: [12.9282, 77.6262, 12.9289, 77.6269],
    centroid: [12.92855, 77.62655],
    capacity: 150
  },
  {
    id: 'food-court',
    name: 'Food Court',
    type: 'food',
    bbox: [12.9276, 77.6268, 12.9282, 77.6277],
    centroid: [12.9279, 77.62725],
    capacity: 120
  },
  {
    id: 'restrooms',
    name: 'Restrooms',
    type: 'facility',
    bbox: [12.9272, 77.6278, 12.9278, 77.6285],
    centroid: [12.9275, 77.62815],
    capacity: 80
  },
  {
    id: 'seating-west',
    name: 'Seating West',
    type: 'seating',
    bbox: [12.9270, 77.6260, 12.9280, 77.6268],
    centroid: [12.9275, 77.6264],
    capacity: 400
  },
  {
    id: 'seating-east',
    name: 'Seating East',
    type: 'seating',
    bbox: [12.9270, 77.6278, 12.9280, 77.6288],
    centroid: [12.9275, 77.6283],
    capacity: 420
  },
  {
    id: 'medical',
    name: 'Medical Help Desk',
    type: 'safety',
    bbox: [12.9281, 77.6277, 12.9286, 77.6283],
    centroid: [12.92835, 77.6280],
    capacity: 25
  }
];
