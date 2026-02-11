import React from 'react';
import { EligibilityResult, Language } from '../types';
import { getTranslation } from '../translations';

interface ResultsDisplayProps {
  result: EligibilityResult;
  aiAdvice: string | null;
  loadingAdvice: boolean;
  onReset: () => void;
  lang: Language;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, aiAdvice, loadingAdvice, onReset, lang }) => {
  const t = getTranslation(lang);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ELIGIBLE': return 'bg-green-100 text-green-800 border-green-200';
      case 'CONDITIONAL': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'INELIGIBLE': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ELIGIBLE': return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      );
      case 'CONDITIONAL': return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-600">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 5.75a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 5.75zM12 14.25a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
      );
      case 'INELIGIBLE': return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-600">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header Status */}
        <div className={`p-6 border-b flex items-center gap-4 ${getStatusColor(result.status)}`}>
           <div className="bg-white p-2 rounded-full shadow-sm">
             {getStatusIcon(result.status)}
           </div>
           <div>
             <h2 className="text-2xl font-bold tracking-tight">{result.status}</h2>
             <p className="opacity-90 font-medium">Score: {result.score} / 110</p>
           </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Main Explanation */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">{t.analysisTitle}</h3>
            <p className="text-lg text-gray-800 leading-relaxed">{result.explanation}</p>
          </div>

          {/* Missing Documents */}
          {result.missing.length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {t.actionRequired}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-orange-800">
                {result.missing.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Advice Section */}
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 relative">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path d="M16.5 7.5h-9v9h9v-9z" />
                <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v1.5h2.25V3a.75.75 0 011.5 0v1.5H15V3a.75.75 0 011.5 0v1.5h.75c.621 0 1.125.504 1.125 1.125v.75h1.5a.75.75 0 010 1.5h-1.5v2.25h1.5a.75.75 0 010 1.5h-1.5v2.25h1.5a.75.75 0 010 1.5h-1.5v.75c0 .621-.504 1.125-1.125 1.125h-.75v1.5a.75.75 0 01-1.5 0v-1.5H12.75v1.5a.75.75 0 01-1.5 0v-1.5H9v1.5a.75.75 0 01-1.5 0v-1.5h-.75a1.125 1.125 0 01-1.125-1.125v-.75h-1.5a.75.75 0 010-1.5h1.5v-2.25h-1.5a.75.75 0 010-1.5h1.5v-2.25h-1.5a.75.75 0 010-1.5h1.5V6.375c0-.621.504-1.125 1.125-1.125H9V3a.75.75 0 01-.75-.75zM6.75 6.75v10.5h10.5V6.75H6.75z" clipRule="evenodd" />
              </svg>
              {t.aiAdviceTitle}
            </h3>
            {loadingAdvice ? (
               <div className="flex items-center gap-2 text-blue-700 animate-pulse">
                 <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                 <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                 <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                 <span className="text-sm">Generating personalized advice...</span>
               </div>
            ) : (
               <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
                 {aiAdvice || "AI advice is currently unavailable."}
               </p>
            )}
          </div>

          {/* Alternatives */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">{t.alternativesTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.alternatives.map((scheme, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="mt-1 min-w-[16px]">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600">
                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                     </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{scheme}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
             <button className="flex-1 bg-green-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-800 transition-colors shadow-sm">
                {t.helpButton}
             </button>
             <button onClick={onReset} className="flex-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                {t.resetButton}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};