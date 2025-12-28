import React, { useState } from 'react';
import { StructuredPrompt } from '../types';

interface ResultSectionProps {
  data: StructuredPrompt;
}

const ResultSection: React.FC<ResultSectionProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'json'>('structured');
  const [copied, setCopied] = useState(false);

  const getFormattedJson = () => {
    // Use 4 spaces for indentation to emphasize hierarchy
    const jsonString = JSON.stringify(data, null, 4);
    
    // Add extra newlines before top-level keys to create visual separation/breathing room between sections.
    // This replaces the standard "newline + 4 spaces + quote" with "double newline + 4 spaces + quote".
    // This effectively adds a blank line between top-level properties.
    return jsonString.replace(/\n    "/g, '\n\n    "');
  };

  const handleCopy = () => {
    // Copy the clean 4-space indent version without extra blank lines if preferred, 
    // or the formatted one. Usually for clipboard, standard JSON is better, 
    // but formatted is nicer. Let's copy standard 4-space JSON.
    const textToCopy = JSON.stringify(data, null, 4);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Removed Reasoning Strategy as per request and renumbered Output Format
  const sections = [
    { key: 'system_role', title: '1. 系统与角色 (System & Role)', desc: '定义模型是谁（角色），以及它的总体目标。' },
    { key: 'context_variables', title: '2. 上下文与变量 (Context & Variables)', desc: '任务的背景信息以及需要动态替换的参数。' },
    { key: 'instructions_constraints', title: '3. 指令与约束 (Instructions & Constraints)', desc: '积极的“做什么”和消极的“不做什么”。' },
    { key: 'few_shot_examples', title: '4. 示例 (Few-Shot Examples)', desc: '提供输入输出的样本以指导模型。' },
    { key: 'output_format', title: '5. 输出格式 (Output Format)', desc: '严格定义的JSON Schema。' },
  ];

  return (
    <div className="border-2 border-gray-800 rounded-lg overflow-hidden bg-white mt-8 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-gray-100 border-b border-gray-300 px-4 py-2">
        <div className="flex space-x-1">
           <button
             onClick={() => setActiveTab('structured')}
             className={`px-6 py-1.5 text-sm font-medium rounded-t-md border-b-2 transition-colors ${activeTab === 'structured' ? 'bg-white border-gray-800 text-gray-900' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
           >
             常用
           </button>
           <button
             onClick={() => setActiveTab('json')}
             className={`px-6 py-1.5 text-sm font-medium rounded-t-md border-b-2 transition-colors ${activeTab === 'json' ? 'bg-white border-gray-800 text-gray-900' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
           >
             json格式
           </button>
        </div>
        
        <div className="flex items-center">
            {copied && (
                <span className="text-emerald-600 text-sm mr-2 font-medium flex items-center animate-pulse">
                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                     Copied!
                </span>
            )}
            <button 
                onClick={handleCopy}
                className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 transition-colors text-gray-700"
                title="Copy JSON"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 bg-brand-50 min-h-[500px]">
        {activeTab === 'structured' ? (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.key} className="space-y-2">
                <div className="flex items-baseline space-x-2">
                    <h3 className="font-semibold text-gray-800 text-base">{section.title}</h3>
                    <span className="text-gray-500 text-xs">{section.desc}</span>
                </div>
                <div className="w-full bg-white border border-gray-300 rounded-lg p-4 shadow-sm text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
                  {/* Access dynamic key safely */}
                  {data[section.key as keyof StructuredPrompt]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-[#1e1e1e] rounded-lg p-6 overflow-auto shadow-inner border border-gray-700 text-left">
             <pre className="text-sm font-mono whitespace-pre-wrap break-all leading-relaxed text-[#9cdcfe]">
{getFormattedJson()}
             </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultSection;