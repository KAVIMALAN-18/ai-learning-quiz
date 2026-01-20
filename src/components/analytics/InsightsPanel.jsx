import React from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';

function List({ title, items }) {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-sm text-gray-600">No insights available.</li>}
        {items.map((it) => (
          <li key={it.topic} className="p-3 bg-gray-50 rounded"> 
            <div className="text-sm font-medium text-gray-900">{it.topic}</div>
            <div className="text-xs text-gray-600 mt-1">{it.note}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InsightsPanel({ strengths = [], needs = [] }) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Learning Insights</div>
            <div className="text-lg font-semibold">Personalized strengths & recommendations</div>
          </div>
          <Button variant="ghost">View full report</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <List title="Strengths" items={strengths} />
        </Card>
        <Card>
          <List title="Needs Improvement" items={needs} />
        </Card>
      </div>
    </div>
  );
}

InsightsPanel.propTypes = {
  strengths: PropTypes.array,
  needs: PropTypes.array,
};
