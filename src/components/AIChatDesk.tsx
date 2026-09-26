import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Info,
  CornerDownLeft,
  Mic,
  MicOff,
  Radio,
  MessageSquare,
  Play,
  Pause,
  Square,
  Headphones,
  Settings2
} from 'lucide-react';
import { Language, CitizenProfile, Scheme } from '../types';
import { translations } from '../translations';
import { mockSchemes } from '../data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedSchemes?: Scheme[];
  lang?: Language;
}

interface AIChatDeskProps {
  currentLang: Language;
  profile: CitizenProfile;
  onOpenSchemeDetails: (schemeId: string) => void;
  onNavigateToComplaint: () => void;
  isTalkMode?: boolean;
}

export const AIChatDesk: React.FC<AIChatDeskProps> = ({
  currentLang,
  profile,
  onOpenSchemeDetails,
  onNavigateToComplaint,
  isTalkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;

  // View Mode: 'voice' (Talk with AI / Telugu Voice Mode) vs 'chat' (Text Chat Desk)
  const [activeMode, setActiveMode] = useState<'voice' | 'chat'>(isTalkMode ? 'voice' : 'chat');

  // Voice language preference: default to Telugu for the talking feature
  const [voiceLang, setVoiceLang] = useState<'te' | 'tenglish' | 'en' | 'hi'>('te');
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(true);

  // Speech Recognition & Synthesis states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcriptInterim, setTranscriptInterim] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  const getInitialGreeting = (lang: Language): string => {
    if (lang === 'te' || voiceLang === 'te') {
      return `నమస్కారం ${profile.fullName}! నేను మీ **సేవామిత్ర AI తెలుగు వాయిస్ సహాయకుడిని**.\n\nమీరు తెలుగులో మాట్లాడవచ్చు లేదా టైప్ చేయవచ్చు. ప్రభుత్వ పథకాలు, స్కాలర్‌షిప్‌లు, తిరస్కరణ కారణాలు లేదా రోడ్డు/నీటి సమస్యలపై ఫిర్యాదుల గురించి అడగండి. నేను మీకు తెలుగులోనే వివరిస్తాను!`;
    }
    if (lang === 'tenglish' || voiceLang === 'tenglish') {
      return `Namaskaram ${profile.fullName}! Nenu mee **SevaMitra AI Civic Voice Assistant**.\n\nMeeru Telugu lo voice tho matladachu. Central & State schemes, scholarship requirements, leda civic complaints gurinchi edhaina adagandi. Nenu simple ga voice tho explain chesthanu!`;
    }
    if (lang === 'hi') {
      return `नमस्ते ${profile.fullName}! मैं आपका **सेवामित्र AI नागरिक सहायक** हूँ।\n\nआपकी सत्यापित प्रोफ़ाइल के अनुसार सरकारी योजनाओं, छात्रवृत्ति या लोक शिकायतों के निवारण हेतु सहायता के लिए मुझसे पूछें।`;
    }
    return `Namaste ${profile.fullName}! I am your **SevaMitra AI Civic Assistant**.\n\nBased on your verified profile (**${profile.profession}**, **${profile.casteCategory}**, Hyderabad), you can speak with me in Telugu or English to explore welfare benefits and file public grievances.`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: getInitialGreeting(currentLang),
      timestamp: 'Just now',
      lang: voiceLang,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync mode if isTalkMode changes from navigation
  useEffect(() => {
    if (isTalkMode) {
      setActiveMode('voice');
      setVoiceLang('te');
    }
  }, [isTalkMode]);

  // Check speech synthesis and recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('speechSynthesis' in window)) {
        setSpeechSupported(false);
      }
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setRecognitionSupported(false);
      }
    }
  }, []);

  // Update greeting when voice language changes if initial message only
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'msg-init') {
      setMessages([
        {
          id: 'msg-init',
          role: 'assistant',
          content: getInitialGreeting(currentLang),
          timestamp: 'Just now',
          lang: voiceLang,
        },
      ]);
    }
  }, [currentLang, voiceLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clean text for speech synthesis
  const cleanForSpeech = (rawText: string): string => {
    return rawText
      .replace(/[*#_~`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ')
      .trim();
  };

  // Text-To-Speech implementation with Telugu voice support
  const handleSpeak = (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      if (speakingMsgId === msgId) return; // If same message clicked, toggle off
    }

    const cleanText = cleanForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;

    // Voice selection: prioritize native Telugu voice
    const voices = window.speechSynthesis.getVoices();
    const teluguVoice = voices.find(v => 
      v.lang === 'te-IN' || 
      v.lang.startsWith('te') || 
      v.name.toLowerCase().includes('telugu')
    );
    const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));

    if (voiceLang === 'te') {
      utterance.lang = 'te-IN';
      if (teluguVoice) utterance.voice = teluguVoice;
    } else if (voiceLang === 'tenglish') {
      utterance.lang = 'te-IN';
      if (teluguVoice) utterance.voice = teluguVoice;
      else if (indianVoice) utterance.voice = indianVoice;
    } else if (voiceLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
      if (indianVoice) utterance.voice = indianVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (msgId) setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  };

  // Speech Recognition (Microphone Voice Input in Telugu)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your query.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      // Set recognition language
      if (voiceLang === 'te') {
        recognition.lang = 'te-IN';
      } else if (voiceLang === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setTranscriptInterim('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setInput(final);
          setTranscriptInterim('');
          handleSend(final);
        } else {
          setTranscriptInterim(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  // Send message
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    // Stop listening or current speech
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (isSpeaking) {
      handleStopSpeaking();
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTranscriptInterim('');
    setLoading(true);

    try {
      const effectiveLang = voiceLang === 'te' ? 'te' : voiceLang === 'tenglish' ? 'tenglish' : currentLang;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          citizenProfile: profile,
          language: effectiveLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply;

        // Check if query is looking for schemes to attach clickable scheme cards
        let matchingSchemes: Scheme[] | undefined;
        const lowerQ = query.toLowerCase();
        if (lowerQ.includes('scheme') || lowerQ.includes('scholarship') || lowerQ.includes('పథకం') || lowerQ.includes('యोजना') || lowerQ.includes('వివరాలు')) {
          matchingSchemes = mockSchemes.slice(0, 3);
        }

        const newMsgId = `ai-${Date.now()}`;
        const aiMessage: Message = {
          id: newMsgId,
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          suggestedSchemes: matchingSchemes,
          lang: effectiveLang,
        };

        setMessages(prev => [...prev, aiMessage]);

        // Auto-Play Voice if in Voice Mode or autoPlayVoice is enabled
        if (autoPlayVoice || activeMode === 'voice') {
          setTimeout(() => {
            handleSpeak(replyText, newMsgId);
          }, 300);
        }
      } else {
        throw new Error('API fallback');
      }
    } catch (err) {
      // Local clean fallback response in Telugu
      let fallbackText = '';
      if (voiceLang === 'te') {
        fallbackText = `మీ ధృవీకరించిన విద్యార్థి ప్రొఫైల్ ప్రకారం మీరు **పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ (Post-Matric Scholarship)** మరియు **ఆయుష్మాన్ భారత్ (PM-JAY)** పథకాలకు 95% పైగా అర్హత కలిగి ఉన్నారు. వివరాలు పరిశీలించడానికి కింద ఉన్న కార్డ్ క్లిక్ చేయండి.`;
      } else if (voiceLang === 'tenglish') {
        fallbackText = `Mee verified student profile ki **Post-Matric Scholarship** mariyu **Ayushman Bharat** 95%+ match avthunnayi. Complete details kosam kinda unna scheme cards chudandi.`;
      } else if (voiceLang === 'hi') {
        fallbackText = `आपकी सत्यापित छात्र प्रोफ़ाइल के अनुसार आप **पोस्ट-मैट्रिक छात्रवृत्ति** तथा **आयुष्मान भारत (PM-JAY)** के लिए 95% से अधिक पात्र हैं।`;
      } else {
        fallbackText = `Based on your verified student profile in Hyderabad, you are eligible for the **Post-Matric Scholarship for OBC Students** and **Ayushman Bharat (PM-JAY)**. Click below to inspect verified eligibility criteria.`;
      }

      const fallbackMsgId = `ai-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: fallbackMsgId,
          role: 'assistant',
          content: fallbackText,
          timestamp: 'Just now',
          suggestedSchemes: mockSchemes.slice(0, 2),
          lang: voiceLang,
        },
      ]);

      if (autoPlayVoice || activeMode === 'voice') {
        setTimeout(() => {
          handleSpeak(fallbackText, fallbackMsgId);
        }, 300);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    handleStopSpeaking();
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'assistant',
        content: getInitialGreeting(currentLang),
        timestamp: 'Just now',
        lang: voiceLang,
      },
    ]);
  };

  // Quick Telugu Voice Questions for instant 1-tap asking & speaking
  const teluguVoicePrompts = [
    { label: 'నాకు ఏ స్కాలర్‌షిప్‌లు వస్తాయి?', text: 'నా ధృవీకరించిన ప్రొఫైల్ ప్రకారం నాకు ఏ స్కాలర్‌షిప్ పథకాలు వర్తిస్తాయి?' },
    { label: 'పాడైన రోడ్డుపై ఫిర్యాదు ఎలా చేయాలి?', text: 'మా ప్రాంతంలో పాడైన రోడ్డు గురించి ఫిర్యాదు ఎలా నమోదు చేయాలి?' },
    { label: 'ఆయుష్మాన్ భారత్ కార్డ్ ఎలా పొందాలి?', text: 'ఆయుష్మాన్ భారత్ పథకం కింద ఉచిత చికిత్స కార్డు ఎలా పొందాలి?' },
    { label: 'నా పథక దరఖాస్తు ఎందుకు తిరస్కరించబడింది?', text: 'నా పథక దరఖాస్తు ఎందుకు తిరస్కరించబడింది మరియు తదుపరి ఏమి చేయాలి?' },
    { label: 'పీఎం ఆవాస్ యోజన అర్హత ఏమిటి?', text: 'ప్రధాన మంత్రి ఆవాస్ యోజన ఇళ్ల పథకానికి అర్హత నిబంధనలు ఏమిటి?' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[560px]">
      {/* Top Header Bar with Mode Switcher & Telugu Voice Controls */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-800/80 border border-blue-400/30 flex items-center justify-center text-blue-200 shadow-xs relative">
            <Bot className="w-5 h-5 text-blue-300" />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight">Sarkari SevaMitra AI</h3>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-amber-400" />
                <span>తెలుగు వాయిస్ (Telugu Talking)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive Telugu Speech Synthesis & Voice Navigation • DigiLocker Grounded
            </p>
          </div>
        </div>

        {/* Right Header Controls: Mode Switch & Voice Options */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle: Voice vs Chat */}
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => {
                setActiveMode('voice');
                setVoiceLang('te');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeMode === 'voice'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>Talk Mode (వాయిస్)</span>
            </button>

            <button
              onClick={() => setActiveMode('chat')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeMode === 'chat'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Chat Mode (టెక్స్ట్)</span>
            </button>
          </div>

          {/* Reset Conversation */}
          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Controls & Language Strip */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <Radio className="w-3 h-3 text-blue-900" />
            Speaking Language:
          </span>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setVoiceLang('te')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                voiceLang === 'te' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              తెలుగు (Telugu)
            </button>
            <button
              onClick={() => setVoiceLang('tenglish')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                voiceLang === 'tenglish' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Tenglish
            </button>
            <button
              onClick={() => setVoiceLang('en')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                voiceLang === 'en' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setVoiceLang('hi')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                voiceLang === 'hi' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Voice Playback Speed & Auto-Speech Toggle */}
        <div className="flex items-center gap-3">
          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 animate-pulse">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI మాట్లాడుతోంది (Speaking in Telugu)...</span>
              <button
                onClick={handleStopSpeaking}
                className="ml-1 p-0.5 bg-rose-600 text-white rounded hover:bg-rose-700"
                title="Stop Speaking"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
              </button>
            </div>
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <span className="text-slate-400">Speed:</span>
            <select
              value={speechRate}
              onChange={e => setSpeechRate(parseFloat(e.target.value))}
              className="px-1.5 py-0.5 rounded border border-slate-300 bg-white font-medium text-[11px]"
            >
              <option value={0.8}>0.8x (Slow / స్పష్టంగా)</option>
              <option value={0.95}>1.0x (Normal)</option>
              <option value={1.2}>1.2x (Fast)</option>
            </select>
          </div>

          {/* Auto Read Aloud Checkbox */}
          <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoPlayVoice}
              onChange={e => setAutoPlayVoice(e.target.checked)}
              className="rounded text-blue-900 focus:ring-blue-700"
            />
            <span>Auto Voice Playback</span>
          </label>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DEDICATED FULL-SCREEN TELUGU TALKING / VOICE CONVERSATION VIEW   */}
      {/* ========================================================================= */}
      {activeMode === 'voice' ? (
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-blue-50/20">
          <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between space-y-6">
            {/* Top Interactive Voice Orb & Speech Status */}
            <div className="text-center pt-2 space-y-4">
              <div className="relative inline-block">
                {/* Outer Pulsing Waves when Speaking or Listening */}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  isSpeaking
                    ? 'bg-emerald-100 ring-8 ring-emerald-300/60 animate-pulse'
                    : isListening
                    ? 'bg-rose-100 ring-8 ring-rose-400/60 animate-bounce'
                    : 'bg-blue-100 ring-4 ring-blue-200'
                }`}>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isSpeaking ? 'bg-emerald-600 scale-105' : isListening ? 'bg-rose-600 scale-105' : 'bg-blue-900'
                  }`}>
                    {isSpeaking ? (
                      <Volume2 className="w-12 h-12 text-white animate-pulse" />
                    ) : isListening ? (
                      <Mic className="w-12 h-12 text-white animate-pulse" />
                    ) : (
                      <Headphones className="w-12 h-12 text-white" />
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-xs ${
                    isSpeaking
                      ? 'bg-emerald-600 text-white'
                      : isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-900 text-white'
                  }`}>
                    {isSpeaking ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>AI తెలుగులో మాట్లాడుతోంది (AI Speaking in Telugu)</span>
                      </>
                    ) : isListening ? (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>వినబడుతోంది... మాట్లాడండి (Listening in Telugu...)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>తెలుగు వాయిస్ సిద్ధంగా ఉంది (Telugu Voice Ready)</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Live Speech Recognition Transcript Indicator */}
              {transcriptInterim && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 font-medium max-w-md mx-auto animate-in fade-in">
                  <span className="block text-[10px] text-rose-500 uppercase font-bold">మీరు మాట్లాడుతున్నారు:</span>
                  &quot;{transcriptInterim}&quot;
                </div>
              )}
            </div>

            {/* Latest AI Spoken Response Card */}
            {messages.length > 0 && (
              <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {messages[messages.length - 1].role === 'user' ? 'మీ ప్రశ్న (Your Query)' : 'సేవామిత్ర AI సమాధానం (Spoken Response)'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {messages[messages.length - 1].timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(messages[messages.length - 1].content)}
                      className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1 transition-colors"
                      title="Listen again in Telugu"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>మళ్లీ వినండి (Replay)</span>
                    </button>

                    {isSpeaking && (
                      <button
                        onClick={handleStopSpeaking}
                        className="px-2 py-1 rounded-md text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {messages[messages.length - 1].content}
                </div>

                {/* Suggested Schemes rendered in Voice Mode */}
                {messages[messages.length - 1].suggestedSchemes && (
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {messages[messages.length - 1].suggestedSchemes!.map(s => (
                      <div
                        key={s.id}
                        onClick={() => onOpenSchemeDetails(s.id)}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{s.title}</div>
                          <div className="text-[10px] text-slate-500">{s.department}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-900 shrink-0 ml-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Microphone Tap Button & Telugu Prompts */}
            <div className="space-y-3 pb-2">
              {/* Primary Big Voice Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-blue-900 hover:bg-blue-800 text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 text-white" />
                      <span>మాట్లాడటం ఆపండి (Stop Listening)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 text-amber-400" />
                      <span>తెలుగులో మాట్లాడటానికి నొక్కండి (Tap to Speak in Telugu)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Telugu Voice Query Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block text-center mb-1.5">
                  లేదా ఒక క్లిక్‌తో తెలుగులో అడగండి (Quick Voice Prompts):
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {teluguVoicePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.text)}
                      className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3 h-3 text-blue-700" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: CHAT MODE (TEXT WITH TELUGU AUDIO & MICROPHONE BUILT-IN)         */
        /* ========================================================================= */
        <>
          {/* Suggested Prompt Chips */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide shrink-0">
              {t.suggestedQuestions}
            </span>
            {[
              { label: 'నాకు ఏ పథకాలు వస్తాయి?', text: 'నా ప్రొఫైల్ ఆధారంగా నాకు వర్తించే ప్రభుత్వ సంక్షేమ పథకాలు చూపించు.' },
              { label: 'రోడ్డు సమస్యపై ఫిర్యాదు', text: 'పాడైన రోడ్డు గుంతల గురించి అధికారులకు ఎలా ఫిర్యాదు చేయాలి?' },
              { label: 'స్కాలర్‌షిప్ డాక్యుమెంట్లు', text: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ కోసం ఏ డాక్యుమెంట్లు కావాలి?' },
              { label: 'Decline Reason', text: 'నా పథక దరఖాస్తు ఎందుకు తిరస్కరించబడింది?' },
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt.text)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap text-[11px] font-medium transition-colors shadow-2xs"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-blue-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] opacity-70">
                    <span className="font-semibold">{m.role === 'user' ? 'You' : 'SevaMitra AI'}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed space-y-1 font-sans">
                    {m.content}
                  </div>

                  {/* Actionable Clickable Scheme Cards in Chat */}
                  {m.suggestedSchemes && m.suggestedSchemes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Recommended Schemes:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {m.suggestedSchemes.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => onOpenSchemeDetails(s.id)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-700 cursor-pointer flex items-center justify-between shadow-2xs group transition-colors"
                          >
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                                {s.title}
                              </div>
                              <div className="text-[10px] text-slate-500">{s.department}</div>
                            </div>
                            <span className="text-blue-900 font-bold text-xs flex items-center gap-0.5 shrink-0 ml-2">
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Read Aloud Button for AI messages */}
                  {m.role === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => handleSpeak(m.content, m.id)}
                        className={`text-[11px] flex items-center gap-1 font-bold transition-colors ${
                          speakingMsgId === m.id
                            ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded'
                            : 'text-slate-600 hover:text-blue-900'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>{speakingMsgId === m.id ? 'మాట్లాడుతోంది... (Stop)' : 'తెలుగులో వినండి (Listen)'}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">DigiLocker Verified Context</span>
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
                    {profile.fullName.charAt(0)}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-900 animate-spin" />
                  <span>తెలుగులో సమాచారం పరిశీలిస్తోంది (Analyzing in Telugu)...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer with Telugu Microphone Button */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 shrink-0">
            {isListening && (
              <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-1.5 font-bold">
                  <Mic className="w-4 h-4 text-rose-600 animate-ping" />
                  <span>తెలుగులో మాట్లాడండి... (Listening): {transcriptInterim || 'వింటున్నాము...'}</span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="text-[11px] text-rose-700 underline font-semibold"
                >
                  Done
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="తెలుగులో అడగండి లేదా ఇక్కడ టైప్ చేయండి (Ask in Telugu or English)..."
                className="flex-1 text-xs px-4 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all shadow-2xs font-sans"
              />

              {/* Microphone Voice Input Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="తెలుగులో మాట్లాడండి (Speak in Telugu)"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-blue-900'}`} />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>SevaMitra Telugu Voice Engine is grounded in official government data.</span>
              <button
                type="button"
                onClick={() => setActiveMode('voice')}
                className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
              >
                <Headphones className="w-3 h-3" />
                <span>Open Full Voice Mode (పూర్తి వాయిస్ సంభాషణ)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
