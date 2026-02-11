import { Language } from './types';

export const translations = {
  en: {
    appTitle: "Scheme Saathi",
    subTitle: "Your companion for government benefits",
    checkTitle: "Check Your Eligibility",
    checkSubtitle: "Enter your details below to find relevant government schemes.",
    
    // Form Labels
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Rajesh Kumar",
    ageLabel: "Age",
    incomeLabel: "Annual Income (₹)",
    landLabel: "Land Owned (Acres)",
    occupationLabel: "Occupation",
    occupationPlaceholder: "e.g. Farmer, Carpenter",
    docsTitle: "Document Availability",
    identityProof: "Valid Identity Proof (Aadhaar/Voter ID)",
    bankAccount: "Active Bank Account",
    checkButton: "Check Eligibility",
    checking: "Checking...",

    // Results
    analysisTitle: "Analysis",
    actionRequired: "Action Required",
    aiAdviceTitle: "Saathi Advice (AI)",
    alternativesTitle: "Recommended Alternatives",
    helpButton: "Get Help from CSC",
    resetButton: "Check Another Profile",
    
    // Chat
    chatTitle: "Chat with Saathi",
    chatPlaceholder: "Ask about schemes, docs...",
    chatWelcome: "Namaste! I am Scheme Saathi. How can I help you today?",
  },
  hi: {
    appTitle: "स्कीम साथी",
    subTitle: "सरकारी योजनाओं के लिए आपका साथी",
    checkTitle: "अपनी पात्रता की जाँच करें",
    checkSubtitle: "प्रासंगिक सरकारी योजनाओं को खोजने के लिए नीचे अपना विवरण दर्ज करें।",

    // Form Labels
    nameLabel: "पूरा नाम",
    namePlaceholder: "जैसे: राजेश कुमार",
    ageLabel: "आयु",
    incomeLabel: "वार्षिक आय (₹)",
    landLabel: "स्वामित्व वाली भूमि (एकड़)",
    occupationLabel: "व्यवसाय",
    occupationPlaceholder: "जैसे: किसान, बढ़ई",
    docsTitle: "दस्तावेज़ उपलब्धता",
    identityProof: "वैध पहचान प्रमाण (आधार/वोटर आईडी)",
    bankAccount: "सक्रिय बैंक खाता",
    checkButton: "पात्रता जाँचें",
    checking: "जाँच हो रही है...",

    // Results
    analysisTitle: "विश्लेषण",
    actionRequired: "कार्रवाई आवश्यक",
    aiAdviceTitle: "साथी सलाह (AI)",
    alternativesTitle: "सुझाई गई वैकल्पिक योजनाएं",
    helpButton: "CSC से मदद लें",
    resetButton: "दूसरी प्रोफ़ाइल जाँचें",

    // Chat
    chatTitle: "साथी से चैट करें",
    chatPlaceholder: "योजनाओं या दस्तावेजों के बारे में पूछें...",
    chatWelcome: "नमस्ते! मैं स्कीम साथी हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
  }
};

export const getTranslation = (lang: Language) => translations[lang];