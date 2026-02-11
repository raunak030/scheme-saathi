import { UserProfile, EligibilityResult, Language } from '../types';
import { GoogleGenAI } from "@google/genai";

// Deterministic Rule Engine
export function evaluateEligibility(profile: UserProfile): EligibilityResult {
  let score = 0;
  let missing: string[] = [];
  let reasons: string[] = [];
  
  const age = Number(profile.age);
  const income = Number(profile.income);
  const land = Number(profile.land);

  // RULE ENGINE (Hard Rules)
  if (age >= 18 && age <= 60) {
    score += 20;
  } else {
    reasons.push("AGE_OUT_OF_RANGE");
  }

  if (income <= 200000) {
    score += 25;
  } else {
    reasons.push("INCOME_ABOVE_THRESHOLD");
  }

  if (land > 0 && land <= 2) {
    score += 25;
  } else if (land <= 0) {
     missing.push("Land Ownership Proof");
  } else {
      reasons.push("LAND_ABOVE_LIMIT_FOR_SMALL_FARMER");
  }

  if (profile.bankAccount) {
    score += 15;
  } else {
    missing.push("Bank Account");
  }

  if (profile.identityProof) {
    score += 15;
  } else {
    missing.push("Identity Proof");
  }

  // SOFT RULE
  const isFarmer = profile.occupation.trim().toUpperCase() === "FARMER" || profile.occupation.trim().toUpperCase() === "KISAN";
  if (isFarmer) {
    score += 10;
  }

  // FINAL DECISION LOGIC
  let status: 'ELIGIBLE' | 'CONDITIONAL' | 'INELIGIBLE' = "INELIGIBLE";
  let requiresReview = false;

  if (score >= 85) {
    status = "ELIGIBLE";
    requiresReview = false;
  } else if (score >= 50) {
    status = "CONDITIONAL";
    requiresReview = true;
  }

  return {
    status,
    score,
    reasonCode: reasons[0] || "PARTIAL_ELIGIBILITY",
    explanation: buildExplanation(status, missing),
    missing,
    alternatives: [
      "PMFBY – Crop Insurance",
      "PMJDY – Jan Dhan Yojana",
      "State Farmer Support Scheme"
    ],
    requiresHumanReview: requiresReview,
    timestamp: new Date().toISOString()
  };
}

function buildExplanation(status: string, missing: string[]) {
  if (status === "ELIGIBLE") {
    return "You meet all major eligibility criteria for this scheme.";
  }
  if (status === "CONDITIONAL") {
    return missing.length > 0 
      ? `You are likely eligible, but the following are required: ${missing.join(", ")}.`
      : "You meet some criteria but may need further assessment.";
  }
  return "You do not currently meet the primary eligibility criteria, but alternative schemes are available.";
}

// AI Enhancement using Gemini
export async function getAiAdvice(profile: UserProfile, result: EligibilityResult, lang: Language = 'en'): Promise<string> {
  if (!process.env.API_KEY) return "";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prompt tailored to language
  const prompt = `
    You are "Scheme Saathi", a government scheme advisor.
    User Language preference: ${lang === 'hi' ? 'Hindi' : 'English'}.
    
    User Profile:
    - Age: ${profile.age}
    - Income: ${profile.income}
    - Land: ${profile.land} acres
    - Occupation: ${profile.occupation}
    
    Result:
    - Status: ${result.status}
    - Missing Docs: ${result.missing.join(', ')}
    
    Task:
    Provide a friendly 2-sentence advice paragraph in ${lang === 'hi' ? 'Hindi (Devanagari script)' : 'English'}.
    Explain what steps they should take next based on their status.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Consult your local CSC.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'hi' ? "अभी सलाह उपलब्ध नहीं है।" : "Advice currently unavailable.";
  }
}