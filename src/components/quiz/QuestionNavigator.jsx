import React from 'react';

export default function QuestionNavigator({ total = 0, current = 0, answers = {}, onJump = () => {} }) {
  const items = Array.from({ length: total }, (_, i) => i);
  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map((i) => {
        const answered = answers.hasOwnProperty(i);
        const cls = `w-9 h-9 rounded-full flex items-center justify-center text-sm cursor-pointer border ${i === current ? 'bg-indigo-600 text-white border-indigo-700' : answered ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white hover:bg-gray-50'}`;
        return (
          <button key={i} onClick={() => onJump(i)} className={cls} aria-current={i === current}>
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
