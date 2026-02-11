import React, { useState, useEffect, useRef } from 'react';
import { Language, ChatMessage, UserProfile, EligibilityResult } from '../types';
import { getTranslation } from '../translations';
import { initializeChat, sendMessageToSaathi } from '../services/chatService';

interface ChatWidgetProps {
  lang: Language;
  profile: UserProfile;
  result: EligibilityResult | null;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ lang, profile, result }) => {
  const t = getTranslation(lang);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Initialize chat when language changes
    initializeChat(lang);
    setMessages([{ role: 'model', text: t.chatWelcome }]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isTyping]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Cancel current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Simple heuristic for language selection
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const responseText = await sendMessageToSaathi(userMsg, profile, result);
      const finalText = responseText || "I'm having trouble connecting right now.";
      setMessages(prev => [...prev, { role: 'model', text: finalText }]);
      // Auto-speak response if the user interacted recently (optional, but good for accessibility)
      // Here we only auto-speak if it was a voice interaction usually, but let's keep it manual or implicit?
      // For now, let's not auto-speak on text input to avoid annoyance.
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am unable to respond at the moment.", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleSendAudio(audioBlob);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for voice features.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendAudio = async (audioBlob: Blob) => {
    setMessages(prev => [...prev, { role: 'user', text: "🎤 Sent Audio Message" }]);
    setIsTyping(true);

    try {
      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // MimeType usually audio/webm for MediaRecorder in Chrome
        const mimeType = audioBlob.type || 'audio/webm';

        const responseText = await sendMessageToSaathi(
          { audioData: base64Audio, mimeType }, 
          profile, 
          result
        );

        const finalText = responseText || "I could not understand the audio.";
        setMessages(prev => [...prev, { role: 'model', text: finalText }]);
        
        // Auto-speak the response for voice queries
        speakText(finalText);
      };
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error processing audio.", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90vw] md:w-[400px] mb-4 overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto flex flex-col
        ${isOpen ? 'scale-100 opacity-100 translate-y-0 h-[500px]' : 'scale-90 opacity-0 translate-y-10 h-0'}`}
      >
        {/* Chat Header */}
        <div className="bg-green-700 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="font-bold">{t.chatTitle}</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-green-600 p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed shadow-sm relative
                ${msg.role === 'user' 
                  ? 'bg-green-700 text-white rounded-br-none' 
                  : msg.isError ? 'bg-red-100 text-red-800' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}
              >
                {msg.text}
              </div>
              {/* Speaker Icon for Model messages to replay TTS */}
              {msg.role === 'model' && !msg.isError && (
                 <button 
                   onClick={() => speakText(msg.text)}
                   className="mt-1 ml-1 text-gray-400 hover:text-green-600 transition-colors p-1"
                   title="Read Aloud"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                     <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                     <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                   </svg>
                 </button>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 rounded-bl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendText} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
          
          {/* Mic Button */}
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-3 rounded-full transition-all duration-200 ${isRecording ? 'bg-red-500 text-white scale-110 shadow-lg ring-4 ring-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title="Hold to Speak"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? "Listening..." : t.chatPlaceholder}
            disabled={isRecording}
            className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/50 disabled:bg-gray-50"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isTyping || isRecording}
            className="bg-green-700 text-white p-3 rounded-full hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-700 hover:bg-green-800 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 pointer-events-auto flex items-center justify-center gap-2 group"
      >
        {!isOpen ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="font-semibold hidden group-hover:block transition-all duration-300 whitespace-nowrap">
              {t.chatTitle}
            </span>
          </>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </button>
    </div>
  );
};