import { Layout } from '@/components/Layout';
import { QuizForm } from '@/components/quiz-form/QuizForm';

export default function CreateQuizPage() {
  return (
    <Layout title="New quiz">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">New quiz</h1>
      <QuizForm />
    </Layout>
  );
}
