import { literal, type Transaction } from 'sequelize';
import { Option, Question, Quiz, sequelize } from '../../models';
import { notFound } from '../../utils/httpError';
import { toQuizDto, type QuizDto, type QuizSummaryDto } from './quiz.dto';
import type { CreateQuizInput } from './quiz.schema';

async function findQuizWithQuestions(id: number, transaction?: Transaction): Promise<Quiz | null> {
  return Quiz.findByPk(id, {
    transaction,
    include: [{ model: Question, as: 'questions', include: [{ model: Option, as: 'options' }] }],
    order: [
      [{ model: Question, as: 'questions' }, 'position', 'ASC'],
      [{ model: Question, as: 'questions' }, { model: Option, as: 'options' }, 'position', 'ASC'],
    ],
  });
}

export async function createQuiz(input: CreateQuizInput): Promise<QuizDto> {
  const quizId = await sequelize.transaction(async (transaction) => {
    const quiz = await Quiz.create({ title: input.title }, { transaction });

    for (const [position, question] of input.questions.entries()) {
      const created = await Question.create(
        {
          quizId: quiz.id,
          position,
          type: question.type,
          text: question.text,
          correctBoolean: question.type === 'boolean' ? question.correctAnswer : null,
          correctText: question.type === 'input' ? question.correctAnswer : null,
        },
        { transaction },
      );

      if (question.type === 'checkbox') {
        await Option.bulkCreate(
          question.options.map((option, index) => ({
            questionId: created.id,
            text: option.text,
            isCorrect: option.isCorrect,
            position: index,
          })),
          { transaction },
        );
      }
    }

    return quiz.id;
  });

  return getQuiz(quizId);
}

export async function listQuizzes(): Promise<QuizSummaryDto[]> {
  const rows = (await Quiz.findAll({
    attributes: [
      'id',
      'title',
      'createdAt',
      [
        literal('(SELECT COUNT(*) FROM "questions" WHERE "questions"."quizId" = "Quiz"."id")'),
        'questionCount',
      ],
    ],
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC'],
    ],
    raw: true,
  })) as unknown as {
    id: number;
    title: string;
    createdAt: string | Date;
    questionCount: number | string;
  }[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    questionCount: Number(row.questionCount),
    createdAt: new Date(row.createdAt).toISOString(),
  }));
}

export async function getQuiz(id: number): Promise<QuizDto> {
  const quiz = await findQuizWithQuestions(id);
  if (!quiz) throw notFound('Quiz not found');
  return toQuizDto(quiz);
}

export async function deleteQuiz(id: number): Promise<void> {
  const deleted = await Quiz.destroy({ where: { id } });
  if (deleted === 0) throw notFound('Quiz not found');
}
