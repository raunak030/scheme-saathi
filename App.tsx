import React, { useState } from 'react';
import { Header } from './components/Header';
import { EligibilityForm } from './components/EligibilityForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ChatWidget } from './components/ChatWidget';
import { evaluateEligibility, getAiAdvice } from './services/eligibilityService';
import { UserProfile, EligibilityResult, Language } from './types';
import { getTranslation } from './translations';

export default function App() {
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  
  // Track current form data to pass to chat context even before submission
  const [currentProfile, setCurrentProfile] = useState<UserProfile>({
    name: '', age: '', income: '', land: '', occupation: '', identityProof: false, bankAccount: false
  });

  const t = getTranslation(lang);

  const handleCheckEligibility = async (profile: UserProfile) => {
    setCurrentProfile(profile);
    setLoading(true);
    setResult(null);
    setAiAdvice(null);
    
    // 1. Run deterministic rule engine
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulated delay
    const decision = evaluateEligibility(profile);
    setResult(decision);
    setLoading(false);

    // 2. Run AI enhancement
    if (process.env.API_KEY) {
      setLoadingAdvice(true);
      try {
        const advice = await getAiAdvice(profile, decision, lang);
        setAiAdvice(advice);
      } catch (error) {
        console.error("Failed to get AI advice", error);
        setAiAdvice(lang === 'hi' ? "सलाह उत्पन्न करने में असमर्थ।" : "Could not retrieve advice.");
      } finally {
        setLoadingAdvice(false);
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setAiAdvice(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      <Header lang={lang} setLang={setLang} />
      
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6 relative z-0">
        
        {!result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all">
             <div className="mb-6">
               <h2 className="text-xl font-bold text-gray-800">{t.checkTitle}</h2>
               <p className="text-gray-500 text-sm">{t.checkSubtitle}</p>
             </div>
             <EligibilityForm onSubmit={handleCheckEligibility} isLoading={loading} lang={lang} />
          </div>
        )}

        {result && (
          <ResultsDisplay 
            result={result} 
            aiAdvice={aiAdvice} 
            loadingAdvice={loadingAdvice}
            onReset={handleReset}
            lang={lang}
          />
        )}

      </main>

      <ChatWidget lang={lang} profile={currentProfile} result={result} />

      <footer className="p-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Scheme Saathi.
      </footer>
    </div>
  );
}