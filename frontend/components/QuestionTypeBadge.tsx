import { QUESTION_TYPE_META } from '@/lib/questionTypes';
import type { QuestionType } from '@/types/quiz';

export function QuestionTypeBadge({ type }: { type: QuestionType }) {
  const meta = QUESTION_TYPE_META[type];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.badge}`}>
      {meta.label}
    </span>
  );
}
