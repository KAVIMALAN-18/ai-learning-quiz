import React from 'react';
import PropTypes from 'prop-types';
import { Clock, HelpCircle, Zap, ArrowRight, BrainCircuit } from 'lucide-react';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { SectionHeader, BodyText, Label } from '../ui/Typography';
import Badge from '../ui/Badge';

export default function QuizCard({ quiz, onStart }) {
  const { title, topic, difficulty, questions = [], timeLimit = 0, description } = quiz || {};

  // Calculate duration display
  const questionCount = questions.length || 10;
  const minutes = timeLimit ? Math.ceil(timeLimit / 60) : Math.max(1, Math.ceil(questionCount * 1.5));

  // Difficulty styling - Using design system tokens
  const diffMap = {
    Beginner: { color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    Intermediate: { color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-100" },
    Advanced: { color: "text-error", bg: "bg-error/10", border: "border-error/20" },
  };

  // Normalize difficulty string case
  const normDiff = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase() : 'Beginner';
  const diffStyle = diffMap[normDiff] || diffMap['Beginner'];

  return (
    <Card className="flex flex-col h-full group border-neutral-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <Badge variant={normDiff === 'Beginner' ? 'success' : normDiff === 'Intermediate' ? 'primary' : 'error'}>
          {normDiff}
        </Badge>
        {(quiz.lastScore !== undefined) && (
          <Badge variant={quiz.lastScore >= 70 ? 'success' : 'warning'}>
            {quiz.lastScore}% Score
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <SectionHeader className="mt-0 mb-3 text-xl font-black group-hover:text-primary-600 transition-colors line-clamp-2">
          {title || topic || "General Quiz"}
        </SectionHeader>
        <BodyText className="text-sm text-neutral-500 mb-8 line-clamp-3">
          {description || `Test your knowledge in ${topic} with this focused assessment.`}
        </BodyText>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-6 mb-8 pt-6 border-t border-neutral-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
            <HelpCircle size={14} />
          </div>
          <div className="flex flex-col">
            <Label className="mb-0.5">Questions</Label>
            <span className="text-xs font-bold text-neutral-900">{questionCount} Items</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
            <Clock size={14} />
          </div>
          <div className="flex flex-col">
            <Label className="mb-0.5">Duration</Label>
            <span className="text-xs font-bold text-neutral-900">{minutes}m Est.</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Button
        onClick={() => onStart && onStart(quiz)}
        fullWidth
        variant={quiz.lastScore !== undefined ? "outline" : "primary"}
        className="font-black uppercase tracking-widest text-xs h-12 shadow-sm"
      >
        {quiz.lastScore !== undefined ? 'Retry Assessment' : 'Start Assessment'}
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Card>
  );
}

QuizCard.propTypes = {
  quiz: PropTypes.object,
  onStart: PropTypes.func,
};
