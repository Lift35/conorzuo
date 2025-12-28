import React from 'react';
import { ReasoningStrategy } from '../types';

interface InputSectionProps {
  rawPrompt: string;
  setRawPrompt: (val: string) => void;
  selectedStrategies: ReasoningStrategy[];
  setSelectedStrategies: React.Dispatch<React.SetStateAction<ReasoningStrategy[]>>;
  onOptimize: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  rawPrompt,
  setRawPrompt,
  selectedStrategies,
  setSelectedStrategies,
  onOptimize,
  isLoading,
}) => {
  const toggleStrategy = (strategy: ReasoningStrategy) => {
    setSelectedStrategies((prev) =>
      prev.includes(strategy)
        ? prev.filter((s) => s !== strategy)
        : [...prev, strategy]
    );
  };

  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          请输入你要优化的prompt
        </label>
        <textarea
          value={rawPrompt}
          onChange={(e) => setRawPrompt(e.target.value)}
          placeholder="例如：帮我写一个客服回复生成器，要语气温柔，处理投诉..."
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-colors resize-none bg-slate-50 text-gray-800"
          disabled={isLoading}
        />
      </div>

      {/* Strategy Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          请选择推理策略(?)
        </label>
        <div className="flex flex-col space-y-2">
          {[
            {
              value: ReasoningStrategy.COT,
              label: '思维链 (Chain of Thought, CoT)',
              desc: '要求模型 "Let\'s think step by step"，展示中间推理过程。',
            },
            {
              value: ReasoningStrategy.STEP_BACK,
              label: '后退一步 (Step-back Prompting)',
              desc: '让模型先回答一个与具体任务相关的“通用/宏观问题”，以激活相关知识。',
            },
            {
              value: ReasoningStrategy.SELF_CONSISTENCY,
              label: '自洽性 (Self-consistency)',
              desc: '让模型多次生成推理路径，通过“投票”选出一致的答案。',
            },
          ].map((strategy) => (
            <div key={strategy.value} className="flex items-start cursor-pointer group" onClick={() => toggleStrategy(strategy.value)}>
               <div className={`mt-0.5 w-5 h-5 flex items-center justify-center border-2 rounded transition-colors ${selectedStrategies.includes(strategy.value) ? 'bg-gray-800 border-gray-800' : 'border-gray-300 group-hover:border-gray-500'}`}>
                 {selectedStrategies.includes(strategy.value) && (
                   <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                     <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                   </svg>
                 )}
               </div>
               <div className="ml-3">
                 <span className="font-medium text-gray-800">{strategy.label}: </span>
                 <span className="text-gray-500 text-sm">{strategy.desc}</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onOptimize}
          disabled={isLoading || !rawPrompt.trim()}
          className={`
            px-8 py-3 rounded-md font-medium text-white transition-all shadow-md
            ${isLoading || !rawPrompt.trim() 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:scale-95'}
          `}
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Optimization...</span>
            </span>
          ) : (
            '开始优化 (Optimize)'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;