import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { getTranslation } from '../translations';

interface EligibilityFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  lang: Language;
}

export const EligibilityForm: React.FC<EligibilityFormProps> = ({ onSubmit, isLoading, lang }) => {
  const t = getTranslation(lang);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    age: '',
    income: '',
    land: '',
    occupation: '',
    identityProof: true,
    bankAccount: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-semibold text-gray-700">{t.nameLabel}</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
            placeholder={t.namePlaceholder}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Age */}
        <div className="space-y-1">
          <label htmlFor="age" className="text-sm font-semibold text-gray-700">{t.ageLabel}</label>
          <input
            id="age"
            name="age"
            type="number"
            required
            min="0"
            max="120"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
            placeholder="45"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        {/* Income */}
        <div className="space-y-1">
          <label htmlFor="income" className="text-sm font-semibold text-gray-700">{t.incomeLabel}</label>
          <input
            id="income"
            name="income"
            type="number"
            required
            min="0"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
            placeholder="150000"
            value={formData.income}
            onChange={handleChange}
          />
        </div>

        {/* Land */}
        <div className="space-y-1">
          <label htmlFor="land" className="text-sm font-semibold text-gray-700">{t.landLabel}</label>
          <input
            id="land"
            name="land"
            type="number"
            step="0.1"
            required
            min="0"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
            placeholder="1.5"
            value={formData.land}
            onChange={handleChange}
          />
        </div>

        {/* Occupation */}
        <div className="col-span-1 md:col-span-2 space-y-1">
          <label htmlFor="occupation" className="text-sm font-semibold text-gray-700">{t.occupationLabel}</label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
            placeholder={t.occupationPlaceholder}
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Document Checklist */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.docsTitle}</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="identityProof"
              checked={formData.identityProof}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-600"
            />
            <span className="text-gray-700">{t.identityProof}</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="bankAccount"
              checked={formData.bankAccount}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-600"
            />
            <span className="text-gray-700">{t.bankAccount}</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             {t.checking}
          </span>
        ) : (
          t.checkButton
        )}
      </button>
    </form>
  );
};