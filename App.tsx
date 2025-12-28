import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import StepBackModal from './components/StepBackModal';
import { generateStructuredPrompt } from './services/geminiService';
import { ReasoningStrategy, StructuredPrompt } from './types';

const App: React.FC = () => {
  const [rawPrompt, setRawPrompt] = useState('');
  const [selectedStrategies, setSelectedStrategies] = useState<ReasoningStrategy[]>([]);
  const [result, setResult] = useState<StructuredPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isStepBackModalOpen, setIsStepBackModalOpen] = useState(false);

  const handleOptimizeClick = () => {
    if (!rawPrompt.trim()) return;

    if (selectedStrategies.includes(ReasoningStrategy.STEP_BACK)) {
      setIsStepBackModalOpen(true);
    } else {
      executeOptimization();
    }
  };

  const handleStepBackConfirm = (answer: string) => {
    setIsStepBackModalOpen(false);
    executeOptimization(answer);
  };

  const executeOptimization = async (stepBackAnswer?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const structuredData = await generateStructuredPrompt(rawPrompt, selectedStrategies, stepBackAnswer);
      setResult(structuredData);
    } catch (err) {
      setError("An error occurred while generating the prompt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <header className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Prompt Generator</h1>
                <p className="mt-2 text-gray-600">
                    Transform your raw ideas into high-quality, structured JSON prompts engineered for LLMs.
                </p>
            </header>

            <main>
                <InputSection 
                    rawPrompt={rawPrompt}
                    setRawPrompt={setRawPrompt}
                    selectedStrategies={selectedStrategies}
                    setSelectedStrategies={setSelectedStrategies}
                    onOptimize={handleOptimizeClick}
                    isLoading={isLoading}
                />

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                {result && <ResultSection data={result} />}
            </main>

            <StepBackModal 
              isOpen={isStepBackModalOpen}
              onClose={() => setIsStepBackModalOpen(false)}
              onConfirm={handleStepBackConfirm}
            />
        </div>
    </div>
  );
};

export default App;