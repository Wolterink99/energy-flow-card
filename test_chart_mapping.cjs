const fs = require('fs');

const zonneplan = JSON.parse(fs.readFileSync('zonneplan_dump.json', 'utf8'));
const forecast = zonneplan.attributes.forecast || [];

try {
  const nowTime = Date.now();
  let closestIdx = 0;
  let minDiff = Infinity;
  forecast.forEach((entry, idx) => {
    const diff = Math.abs(new Date(entry.datetime).getTime() - nowTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = idx;
    }
  });

  const startIndex = Math.max(0, closestIdx - 2);
  const filtered = forecast.slice(startIndex);
  
  const currentHourStart = new Date(forecast[closestIdx].datetime);

  // Calculate Y bounds
  const pricesOnly = filtered.map((entry) => parseFloat(entry.electricity_price) / 10000000);
  const maxPriceVal = Math.max(...pricesOnly, 0.40);
  const minPriceVal = Math.min(...pricesOnly, 0.0);
  
  // Next multiples of 0.20
  const maxY = Math.max(0.40, Math.ceil(maxPriceVal * 5) / 5);
  const minY = minPriceVal < 0 ? Math.floor(minPriceVal * 5) / 5 : 0.0;
  const priceRange = maxY - minY;

  // Chart area within 500x190 viewBox
  const chartLeft = 50;
  const chartRight = 485;
  const chartWidth = chartRight - chartLeft;
  const chartTop = 35;
  const chartHeight = 110;
  const chartBottom = chartTop + chartHeight;
  const zeroY = chartBottom - ((0.0 - minY) / priceRange) * chartHeight;

  const step = chartWidth / filtered.length;
  const barWidth = Math.max(4, step - 6);

  // Map points
  const points = filtered.map((entry, idx) => {
    const date = new Date(entry.datetime);
    const hourLabel = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    const priceEur = parseFloat(entry.electricity_price) / 10000000;
    const x = chartLeft + idx * step + step / 2;
    const y = chartBottom - ((priceEur - minY) / priceRange) * chartHeight;
    const isCurrent = date.getTime() === currentHourStart.getTime();

    return {
      x,
      y,
      price: priceEur,
      label: hourLabel,
      isCurrent,
      isNeg: priceEur < 0,
      datetime: entry.datetime
    };
  });

  console.log('SUCCESS! Points generated:', points.length);
  console.log('Sample point:', points[0]);
  console.log('Min point:', points.reduce((min, p) => p.price < min.price ? p : min, points[0]));
  console.log('Max point:', points.reduce((max, p) => p.price > max.price ? p : max, points[0]));
  console.log('zeroY:', zeroY);
  console.log('maxY:', maxY, 'minY:', minY);
} catch (e) {
  console.error('ERROR during chart mapping calculation:', e);
}
