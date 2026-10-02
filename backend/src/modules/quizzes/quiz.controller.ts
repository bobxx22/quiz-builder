import type { Request, Response } from 'express';
import { createQuizSchema, quizIdParamSchema } from './quiz.schema';
import * as quizService from './quiz.service';

export async function createQuiz(req: Request, res: Response): Promise<void> {
  const input = createQuizSchema.parse(req.body);
  const quiz = await quizService.createQuiz(input);
  res.status(201).json(quiz);
}

export async function listQuizzes(_req: Request, res: Response): Promise<void> {
  res.json(await quizService.listQuizzes());
}

export async function getQuiz(req: Request, res: Response): Promise<void> {
  const { id } = quizIdParamSchema.parse(req.params);
  res.json(await quizService.getQuiz(id));
}

export async function deleteQuiz(req: Request, res: Response): Promise<void> {
  const { id } = quizIdParamSchema.parse(req.params);
  await quizService.deleteQuiz(id);
  res.status(204).send();
}
