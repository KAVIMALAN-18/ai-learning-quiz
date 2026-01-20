import React from 'react';
import PropTypes from 'prop-types';

export default function QuizCard({ quiz, onStart }) {
  const { title, topic, difficulty, questions = [], timeLimit = 0 } = quiz || {};
  const minutes = timeLimit ? Math.ceil(timeLimit / 60) : Math.max(1, Math.ceil((questions.length || 10) * 0.5));

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title || topic}</h3>
          <span className={`text-xs px-2 py-1 rounded ${difficulty === 'Advanced' ? 'bg-red-50 text-red-600' : difficulty === 'Beginner' ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'}`}>
            {difficulty}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600">{quiz.description || `A focused quiz on ${topic}.`}</p>

        <div className="mt-4 flex gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2"><span className="font-medium text-gray-700">{questions.length || '—'}</span><span>questions</span></div>
          <div className="flex items-center gap-2"><span className="font-medium text-gray-700">{minutes}m</span><span>est.</span></div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs text-gray-500">AI Mode: <span className="text-indigo-600 font-medium">Gemini</span></div>
        <button onClick={() => onStart && onStart(quiz)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Start Quiz</button>
      </div>
    </div>
  );
}

QuizCard.propTypes = {
  quiz: PropTypes.object,
  onStart: PropTypes.func,
};
