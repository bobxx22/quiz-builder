import type { CreateQuizPayload, Quiz, QuizSummary } from '@/types/quiz';
import { apiFetch } from './apiClient';

export const quizService = {
  list: () => apiFetch<QuizSummary[]>('/quizzes'),
  get: (id: number | string) => apiFetch<Quiz>(`/quizzes/${id}`),
  create: (payload: CreateQuizPayload) =>
    apiFetch<Quiz>('/quizzes', { method: 'POST', body: JSON.stringify(payload) }),
  remove: (id: number) => apiFetch<void>(`/quizzes/${id}`, { method: 'DELETE' }),
};
