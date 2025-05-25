import { ChoiceTest } from '@/components/ChoiceTest';

export default function TestChoicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold neon-text text-center mb-8">
          A/B Choice Testing
        </h1>
        <ChoiceTest />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Test A/B Choices - Weave',
  description: 'Test page for debugging A/B choice functionality',
}; 