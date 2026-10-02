import { Router } from 'express';
import * as controller from './quiz.controller';

export const quizRouter = Router();

quizRouter.post('/', controller.createQuiz);
quizRouter.get('/', controller.listQuizzes);
quizRouter.get('/:id', controller.getQuiz);
quizRouter.delete('/:id', controller.deleteQuiz);
