import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile, EligibilityResult, Language } from '../types';

let chatSession: Chat | null = null;

export const initializeChat = (lang: Language) => {
  if (!process.env.API_KEY) return null;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are 'Scheme Saathi', an expert Indian Government Scheme Advisor.
    Your goal is to help citizens understand eligibility, required documents, and application processes for schemes like PM-Kisan, PMFBY, Ayushman Bharat, etc.
    
    Traits:
    - Polite, empathetic, and professional.
    - Uses simple language suitable for rural citizens.
    - If the user speaks Hindi/Hinglish, reply in Hindi. If English, reply in English.
    - Always strictly follow the language setting provided: currently '${lang === 'hi' ? 'HINDI' : 'ENGLISH'}'.
    
    Context:
    You have access to the user's profile data if they have filled the form. Use it to give personalized answers.
    
    Input Handling:
    - The user may send audio. If you receive audio, listen carefully and respond to the question asked in the audio.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction,
    }
  });

  return chatSession;
};

export const sendMessageToSaathi = async (
  input: string | { audioData: string; mimeType: string }, 
  profile?: UserProfile, 
  result?: EligibilityResult | null
) => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  // Prepare Context
  let contextStr = "";
  if (profile) {
    const profileSummary = `[Context: User is ${profile.age} years old ${profile.occupation}, Income: ${profile.income}, Land: ${profile.land} acres. Status: ${result?.status || 'Unknown'}]`;
    contextStr = `${profileSummary}\n\n`;
  }

  let messagePayload: any;

  if (typeof input === 'string') {
    // Text Input
    messagePayload = contextStr + "User Question: " + input;
  } else {
    // Audio Input
    // We send an array of parts: Context (Text) + Audio (InlineData)
    messagePayload = [
      { text: contextStr + "User sent an audio message. Please listen and respond." },
      { 
        inlineData: {
          data: input.audioData,
          mimeType: input.mimeType
        }
      }
    ];
  }

  const response = await chatSession.sendMessage({
    message: messagePayload
  });

  return response.text;
};