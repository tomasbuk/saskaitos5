// FILE: src/utils/colors.js
export const getBusenaColor = (busena) => {
  switch (busena) {
    case 'Apmokėta': return '#d4edda';
    case 'Neapmokėta': return '#f8d7da';
    case 'Nuosavos lėšos': return '#e2e3e5';
    case 'Dalinai apmokėta': return '#fffacd';
    default: return '#e9f5ff';
  }
};