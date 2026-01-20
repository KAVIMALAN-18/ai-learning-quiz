import React from 'react';
import PropTypes from 'prop-types';

export default function TrendSparkline({ data = [], width = 120, height = 40 }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const points = data.map((d, i) => `${(i/(data.length-1 || 1))*width},${height - ((d - min)/(max - min || 1))*height}`).join(' ');
  return (
    <svg width={width} height={height} className="block">
      <polyline points={points} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

TrendSparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  height: PropTypes.number,
};
