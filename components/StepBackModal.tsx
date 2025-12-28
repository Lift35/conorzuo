import React, { useState } from 'react';

interface StepBackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (answer: string) => void;
}

const StepBackModal: React.FC<StepBackModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [answer, setAnswer] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-fadeIn">
        <h3 className="text-xl font-bold text-gray-900">Step-back Prompting</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
           请回答一个通用/宏观问题以激活相关知识 
           <br/>
           <span className="text-gray-500 italic">(Please answer a general/macro question to activate relevant knowledge)</span>
        </p>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-gray-800 bg-gray-50 text-sm"
          placeholder="例如：客户服务的核心原则是什么？"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm"
          >
            取消 (Cancel)
          </button>
          <button
            onClick={() => onConfirm(answer)}
            disabled={!answer.trim()}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors text-sm ${
              answer.trim() ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            继续优化 (Continue)
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepBackModal;