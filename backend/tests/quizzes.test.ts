import './setup';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import type { Server } from 'node:http';
import { createApp } from '../src/app';
import { syncDatabase } from '../src/db/sync';
import { Option, Question, sequelize } from '../src/models';

let server: Server;
let baseUrl: string;

const validQuiz = {
  title: 'Sample quiz',
  questions: [
    { type: 'boolean', text: 'The sky is blue.', correctAnswer: true },
    { type: 'input', text: 'Capital of France?', correctAnswer: 'Paris' },
    {
      type: 'checkbox',
      text: 'Pick the even numbers',
      options: [
        { text: '1', isCorrect: false },
        { text: '2', isCorrect: true },
        { text: '4', isCorrect: true },
      ],
    },
  ],
};

async function api(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

before(async () => {
  await syncDatabase();
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  server.close();
  await sequelize.close();
});

describe('Quizzes API', () => {
  let quizId: number;

  it('POST /quizzes creates a quiz with all question types', async () => {
    const { status, body } = await api('/quizzes', {
      method: 'POST',
      body: JSON.stringify(validQuiz),
    });

    assert.equal(status, 201);
    assert.equal(body.title, 'Sample quiz');
    assert.equal(body.questions.length, 3);
    assert.deepEqual(
      body.questions.map((q: { type: string }) => q.type),
      ['boolean', 'input', 'checkbox'],
    );
    assert.equal(body.questions[0].correctAnswer, true);
    assert.equal(body.questions[1].correctAnswer, 'Paris');
    assert.deepEqual(
      body.questions[2].options.map((o: { text: string }) => o.text),
      ['1', '2', '4'],
    );
    quizId = body.id;
  });

  it('GET /quizzes lists quizzes with question counts', async () => {
    const { status, body } = await api('/quizzes');

    assert.equal(status, 200);
    assert.equal(body.length, 1);
    assert.equal(body[0].id, quizId);
    assert.equal(body[0].title, 'Sample quiz');
    assert.equal(body[0].questionCount, 3);
  });

  it('GET /quizzes/:id returns full quiz details', async () => {
    const { status, body } = await api(`/quizzes/${quizId}`);

    assert.equal(status, 200);
    assert.equal(body.id, quizId);
    assert.equal(body.questions[2].options.length, 3);
    assert.equal(body.questions[2].options[1].isCorrect, true);
  });

  it('GET /quizzes/:id returns 404 for unknown quiz', async () => {
    const { status, body } = await api('/quizzes/9999');
    assert.equal(status, 404);
    assert.equal(body.error, 'HttpError');
  });

  it('GET /quizzes/:id returns 400 for an invalid id', async () => {
    const { status } = await api('/quizzes/abc');
    assert.equal(status, 400);
  });

  it('POST /quizzes validates the payload', async () => {
    const cases = [
      { title: '', questions: validQuiz.questions },
      { title: 'No questions', questions: [] },
      { title: 'Bad type', questions: [{ type: 'essay', text: 'x' }] },
      {
        title: 'No correct option',
        questions: [
          {
            type: 'checkbox',
            text: 'Q',
            options: [
              { text: 'a', isCorrect: false },
              { text: 'b', isCorrect: false },
            ],
          },
        ],
      },
    ];

    for (const payload of cases) {
      const { status, body } = await api('/quizzes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      assert.equal(status, 400, `expected 400 for "${payload.title}"`);
      assert.equal(body.error, 'ValidationError');
    }
  });

  it('POST /quizzes rejects malformed JSON', async () => {
    const { status } = await api('/quizzes', { method: 'POST', body: '{oops' });
    assert.equal(status, 400);
  });

  it('DELETE /quizzes/:id removes the quiz and its questions/options', async () => {
    const { status } = await api(`/quizzes/${quizId}`, { method: 'DELETE' });
    assert.equal(status, 204);

    assert.equal((await api(`/quizzes/${quizId}`)).status, 404);
    assert.deepEqual((await api('/quizzes')).body, []);
    assert.equal(await Question.count(), 0, 'questions should be cascaded');
    assert.equal(await Option.count(), 0, 'options should be cascaded');
  });

  it('DELETE /quizzes/:id returns 404 when nothing to delete', async () => {
    assert.equal((await api(`/quizzes/${quizId}`, { method: 'DELETE' })).status, 404);
  });
});
