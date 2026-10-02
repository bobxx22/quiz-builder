import { Quiz, sequelize } from '../models';
import type { CreateQuizInput } from '../modules/quizzes/quiz.schema';
import { createQuiz } from '../modules/quizzes/quiz.service';
import { syncDatabase } from './sync';

const sampleQuizzes: CreateQuizInput[] = [
  {
    title: 'JavaScript Basics',
    questions: [
      { type: 'boolean', text: 'JavaScript and Java are the same language.', correctAnswer: false },
      {
        type: 'input',
        text: 'Which keyword declares a block-scoped constant?',
        correctAnswer: 'const',
      },
      {
        type: 'checkbox',
        text: 'Which of these are primitive types in JavaScript?',
        options: [
          { text: 'string', isCorrect: true },
          { text: 'number', isCorrect: true },
          { text: 'array', isCorrect: false },
          { text: 'symbol', isCorrect: true },
        ],
      },
    ],
  },
  {
    title: 'Web Fundamentals',
    questions: [
      { type: 'boolean', text: 'HTTP is a stateless protocol.', correctAnswer: true },
      { type: 'input', text: 'Which HTTP status code means "Not Found"?', correctAnswer: '404' },
      {
        type: 'checkbox',
        text: 'Which of these are HTTP methods?',
        options: [
          { text: 'GET', isCorrect: true },
          { text: 'FETCH', isCorrect: false },
          { text: 'DELETE', isCorrect: true },
          { text: 'SEND', isCorrect: false },
        ],
      },
    ],
  },
];

async function seed(): Promise<void> {
  await syncDatabase();

  for (const quiz of sampleQuizzes) {
    const exists = await Quiz.findOne({ where: { title: quiz.title } });
    if (exists) {
      console.log(`Skipping "${quiz.title}" (already exists)`);
      continue;
    }
    const created = await createQuiz(quiz);
    console.log(
      `Created "${created.title}" (id=${created.id}, ${created.questions.length} questions)`,
    );
  }
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
