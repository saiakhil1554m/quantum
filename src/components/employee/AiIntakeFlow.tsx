import React, { useState, useRef, useEffect } from 'react';
import {
  Laptop,
  Cpu,
  HelpCircle,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Copy,
  Layers,
  MapPin,
  Clock,
  Send,
  Zap,
  Mic,
  ImageIcon,
  X,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { aiService, IssueAnalysisResult } from '../../services/ai/AiService';
import { ProblemType, TroubleshootingStep } from '../../types';
import { INITIAL_KNOWLEDGE_ARTICLES } from '../../data/seedData';

export const AiIntakeFlow: React.FC = () => {
  const { createTicket, navigateTo, tickets } = useHelpdesk();

  // User input states
  const [selectedProblemType, setSelectedProblemType] = useState<ProblemType>('software');
  const [selectedSuggestionChip, setSelectedSuggestionChip] = useState<string>('');
  const [deviceDetails, setDeviceDetails] = useState('');
  const [softwareDetails, setSoftwareDetails] = useState('');
  const [prompt, setPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);

  // Optional Image Upload States (PNG, JPG, JPEG max 5MB, multiple)
  const [uploadedImages, setUploadedImages] = useState<{ id: string; name: string; url: string; size: string; type: string }[]>([]);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Real Web Speech API & Voice Dictation States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Analysis & Troubleshooting Flow States
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<IssueAnalysisResult | null>(null);
  const [dismissedConflict, setDismissedConflict] = useState(false);
  const [troubleshootingActive, setTroubleshootingActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepRunning, setStepRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<TroubleshootingStep[]>([]);

  // Resolution outcome
  const [selfServiceResolved, setSelfServiceResolved] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState(false);

  // Quick suggestion topic chips
  const softwareQuickPills = [
    { label: 'VPN Access / AnyConnect', hintText: 'VPN Client Tunnel Issue' },
    { label: 'SAP SolMan / Fiori Password', hintText: 'SAP Credentials & SSO Sync' },
    { label: 'Outlook / Email Sync', hintText: 'Exchange / Outlook Connection' },
    { label: 'Active Directory Lockout', hintText: 'AD Account Lockout' },
  ];

  const hardwareQuickPills = [
    { label: 'Laptop Power / Battery', hintText: 'Workstation Charging & Battery' },
    { label: 'Substation Telecom Optical SFP', hintText: 'Optical Transceiver Switch Link' },
    { label: 'Display & Docking Hub', hintText: 'Monitor / DisplayPort Cable' },
    { label: 'Office Printer / Scanner', hintText: 'Multi-Function Printer Hardware' },
  ];

  // cleanup Speech Recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {}
      }
    };
  }, []);

  // Voice Dictation Toggle with Web Speech API & Fallback
  const handleToggleVoiceDictation = () => {
    setSpeechError(null);

    // If currently listening, stop recognition
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {}
      }
      setIsListening(false);
      return;
    }

    // Check Web Speech API availability in current browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers lacking native SpeechRecognition API
      setSpeechError("Voice dictation API is not supported in this browser. Using voice simulation fallback...");
      handleSimulateVoiceInput();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        if (transcript.trim()) {
          const dictationText = transcript.trim();
          setPrompt(prev => {
            const trimmedPrev = prev.trim();
            if (!trimmedPrev) return dictationText;
            if (trimmedPrev.endsWith('.')) {
              return `${trimmedPrev} ${dictationText}`;
            }
            return `${trimmedPrev}. ${dictationText}`;
          });
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const errType = event.error;
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          setSpeechError("Microphone permission is required for voice dictation.");
        } else if (errType === 'no-speech') {
          setSpeechError("No speech detected. Please speak clearly into your microphone.");
        } else if (errType === 'network') {
          setSpeechError("Network error during speech recognition. Please try again.");
        } else {
          setSpeechError(`Speech recognition error: ${errType}.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setSpeechError("Microphone permission is required for voice dictation.");
    }
  };

  const handleSimulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      const voiceText = selectedProblemType === 'hardware'
        ? "My corporate laptop battery is overheating and the external monitor goes black repeatedly."
        : "My corporate laptop cannot connect to the VPN since this morning.";
      setPrompt(prev => {
        const trimmedPrev = prev.trim();
        if (!trimmedPrev) return voiceText;
        return `${trimmedPrev}. ${voiceText}`;
      });
      setIsListening(false);
    }, 1200);
  };

  // Image Upload Handler
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSizeBytes = 5 * 1024 * 1024;
    const newUploads: { id: string; name: string; url: string; size: string; type: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setImageUploadError(`File "${file.name}" is unsupported. Please select PNG, JPG, or JPEG images.`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        setImageUploadError(`File "${file.name}" exceeds the maximum 5MB size limit.`);
        continue;
      }

      const objectUrl = URL.createObjectURL(file);
      const formattedSize = `${(file.size / 1024).toFixed(0)} KB`;

      newUploads.push({
        id: `img_${Date.now()}_${i}`,
        name: file.name,
        url: objectUrl,
        size: formattedSize,
        type: file.type,
      });
    }

    if (newUploads.length > 0) {
      setUploadedImages(prev => [...prev, ...newUploads]);
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (idToRemove: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const handleSelectProblemType = (type: ProblemType) => {
    setSelectedProblemType(type);
    setDismissedConflict(false);
  };

  const handleSelectQuickSuggestion = (pill: { label: string; hintText: string }) => {
    setSelectedSuggestionChip(pill.label);
    if (!softwareDetails && selectedProblemType === 'software') {
      setSoftwareDetails(pill.label);
    } else if (!deviceDetails && selectedProblemType === 'hardware') {
      setDeviceDetails(pill.label);
    }
  };

  const handleAnalyze = async (textToAnalyze?: string, typeToUse?: ProblemType) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : prompt;
    const currentType = typeToUse || selectedProblemType;

    if (!text.trim()) return;

    setAnalyzing(true);
    setAnalysis(null);
    setTroubleshootingActive(false);
    setCompletedSteps([]);
    setSelfServiceResolved(false);
    setTicketCreated(null);
    setDismissedConflict(false);

    try {
      const res = await aiService.analyzeIssueWithGemini(text, {
        categoryHint: currentType,
        deviceDetails,
        softwareDetails,
        images: uploadedImages.map(img => img.url),
        availableKbArticles: INITIAL_KNOWLEDGE_ARTICLES.map(a => ({
          id: a.id,
          title: a.title,
          category: a.category,
          summary: a.summary,
        })),
        existingTickets: tickets,
        userSelectedType: currentType,
      });
      setAnalysis(res);
    } catch (err) {
      console.warn("AI analysis failed, executing heuristic fallback:", err);
      const fallbackRes = await aiService.analyzeIssue(text, tickets, currentType);
      setAnalysis(fallbackRes);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSwitchToDetectedCategory = (detectedType: ProblemType) => {
    setSelectedProblemType(detectedType);
    setDismissedConflict(true);
    if (prompt.trim()) {
      handleAnalyze(prompt, detectedType);
    }
  };

  const handleStartTroubleshooting = () => {
    setTroubleshootingActive(true);
    setCurrentStepIndex(0);
  };

  const handleExecuteStep = () => {
    if (!analysis || !analysis.suggestedTroubleshooting[currentStepIndex]) return;
    const currentStep = analysis.suggestedTroubleshooting[currentStepIndex];

    setStepRunning(true);

    setTimeout(() => {
      const isFailed = currentStep.id.includes('fail') || currentStep.id === 'step_net_3' || currentStep.id === 'step_hw_2';

      const record: TroubleshootingStep = {
        id: currentStep.id,
        stepName: currentStep.title,
        instruction: currentStep.instruction,
        status: isFailed ? 'failed' : 'passed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        details: isFailed
          ? 'Automated execution failed: Remote diagnostic returned error 503 gateway unreachable.'
          : 'Executed successfully. Telemetry response confirmed green status.',
      };

      setCompletedSteps(prev => [...prev, record]);
      setStepRunning(false);

      if (currentStepIndex + 1 < analysis.suggestedTroubleshooting.length) {
        setCurrentStepIndex(prev => prev + 1);
      }
    }, 1200);
  };

  const handleMarkSelfServiceResolved = () => {
    setSelfServiceResolved(true);
  };

  const handleCreateTicketNow = () => {
    if (!analysis) return;

    const newTicket = createTicket({
      title: analysis.aiSummary || prompt.slice(0, 65) || 'IT Support Assistance Request',
      description: prompt,
      problemType: selectedProblemType,
      aiDetectedProblemType: analysis.problemType,
      aiCategoryConfidence: analysis.aiCategoryConfidence,
      category: analysis.category,
      subcategory: analysis.subcategory,
      service: analysis.service,
      priority: analysis.priority,
      priorityScore: analysis.priorityScore,
      priorityFactors: analysis.priorityFactors,
      assignedTeam: analysis.routingRecommendation,
      aiConfidence: analysis.routingConfidence,
      aiReasoning: analysis.technicalReasoning,
      aiDifficulty: analysis.difficulty || 'MEDIUM',
      aiSummary: analysis.aiSummary || prompt,
      deviceDetails: deviceDetails || undefined,
      softwareDetails: softwareDetails || undefined,
      isAmbiguous: analysis.isAmbiguous,
      ambiguityDetails: analysis.ambiguityDetails,
      suggestedResolution: analysis.suggestedResolution,
      troubleshootingHistory: completedSteps,
      attachments: uploadedImages,
    } as any);

    setTicketCreated(newTicket.id);
  };

  const handleCopyTicketId = () => {
    if (!ticketCreated) return;
    navigator.clipboard.writeText(ticketCreated);
    setCopiedTicketId(true);
    setTimeout(() => setCopiedTicketId(false), 2000);
  };

  // TICKET CREATION SUCCESS STATE
  if (ticketCreated) {
    const isHw = selectedProblemType === 'hardware';
    return (
      <div className="max-w-md mx-auto p-6 sm:p-8 bg-white rounded-xl border border-[#9DB2BF]/60 shadow-xs text-center space-y-5 animate-in fade-in">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#27374D]">Ticket Created Successfully</h2>
          <p className="text-xs text-[#526D82]">
            Your issue has been routed to the appropriate engineering queue.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#526D82] font-semibold">Ticket Reference ID:</span>
            <button
              onClick={handleCopyTicketId}
              className="text-xs text-[#27374D] hover:text-[#526D82] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedTicketId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#9DB2BF]/60">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#27374D]">{ticketCreated}</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                isHw ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-sky-50 text-sky-800 border border-sky-200'
              }`}>
                {isHw ? <Cpu className="w-3 h-3" /> : <Laptop className="w-3 h-3" />}
                <span>{isHw ? 'Hardware' : 'Software'}</span>
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#27374D] text-white">
              {analysis?.routingRecommendation || 'IT Support Queue'}
            </span>
          </div>

          {/* Attached Images summary */}
          {uploadedImages.length > 0 && (
            <div className="pt-2 border-t border-[#9DB2BF]/40">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold block mb-1.5">
                Attached Images ({uploadedImages.length})
              </span>
              <div className="flex gap-2">
                {uploadedImages.map(img => (
                  <img key={img.id} src={img.url} alt={img.name} className="w-12 h-12 object-cover rounded border border-[#9DB2BF]" />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={() => navigateTo('my-tickets')}
            className="w-full py-2.5 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer text-center"
          >
            Track in My Tickets
          </button>
        </div>
      </div>
    );
  }

  // SELF SERVICE SUCCESS STATE
  if (selfServiceResolved) {
    return (
      <div className="max-w-md mx-auto p-6 sm:p-8 bg-white rounded-xl border border-[#9DB2BF]/60 shadow-xs text-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#27374D]">Issue Resolved Autonomously</h2>
          <p className="text-xs text-[#526D82]">
            The automated troubleshooter fixed the issue. No IT support ticket is required.
          </p>
        </div>

        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 rounded-lg bg-[#27374D] text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 font-sans text-[#27374D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#9DB2BF]/60 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#27374D]">Create IT Support Ticket</h1>
          <p className="text-xs text-[#526D82] mt-0.5">
            Follow the guided steps below to describe your issue and receive AI-assisted triage.
          </p>
        </div>

        <button
          onClick={handleToggleVoiceDictation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
              : 'bg-[#DDE6ED]/60 hover:bg-[#DDE6ED] text-[#27374D] border-[#9DB2BF]'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{isListening ? '🎙 Listening...' : '🎙 Voice Dictate'}</span>
        </button>
      </div>

      {/* STEP 1: SELECT PROBLEM TYPE */}
      <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#27374D] text-white text-[10px] font-bold flex items-center justify-center">
            1
          </span>
          <label className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
            Select Problem Category Hint
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Software Issue */}
          <button
            type="button"
            onClick={() => handleSelectProblemType('software')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedProblemType === 'software'
                ? 'bg-[#526D82] text-white border-[#27374D] shadow-xs'
                : 'bg-white text-[#27374D] border-[#9DB2BF]/60 hover:bg-[#DDE6ED]/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Laptop className="w-4 h-4" />
              <h3 className="text-xs font-bold">Software Issue</h3>
            </div>
            <p className={`text-[11px] ${selectedProblemType === 'software' ? 'text-[#DDE6ED]' : 'text-[#526D82]'}`}>
              SAP, VPN, Outlook, Passwords, Apps
            </p>
          </button>

          {/* Hardware Issue */}
          <button
            type="button"
            onClick={() => handleSelectProblemType('hardware')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedProblemType === 'hardware'
                ? 'bg-[#526D82] text-white border-[#27374D] shadow-xs'
                : 'bg-white text-[#27374D] border-[#9DB2BF]/60 hover:bg-[#DDE6ED]/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4" />
              <h3 className="text-xs font-bold">Hardware Issue</h3>
            </div>
            <p className={`text-[11px] ${selectedProblemType === 'hardware' ? 'text-[#DDE6ED]' : 'text-[#526D82]'}`}>
              Laptop, Monitor, Dock, Printer
            </p>
          </button>

          {/* Not Sure */}
          <button
            type="button"
            onClick={() => handleSelectProblemType('unknown')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedProblemType === 'unknown'
                ? 'bg-[#526D82] text-white border-[#27374D] shadow-xs'
                : 'bg-white text-[#27374D] border-[#9DB2BF]/60 hover:bg-[#DDE6ED]/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4" />
              <h3 className="text-xs font-bold">Not Sure</h3>
            </div>
            <p className={`text-[11px] ${selectedProblemType === 'unknown' ? 'text-[#DDE6ED]' : 'text-[#526D82]'}`}>
              Let AI detect automatically
            </p>
          </button>
        </div>
      </div>

      {/* STEP 2: DESCRIBE THE ISSUE MANUALLY + VOICE DICTATE + OPTIONAL IMAGE UPLOAD */}
      <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#27374D] text-white text-[10px] font-bold flex items-center justify-center">
              2
            </span>
            <label className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
              Describe the Issue
            </label>
          </div>
          <span className="text-[11px] text-[#526D82]">Manual User Input Required</span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#526D82]">Quick Topic Chips (Selects Category Hint):</span>
          <div className="flex flex-wrap gap-1.5">
            {(selectedProblemType === 'hardware' ? hardwareQuickPills : softwareQuickPills).map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickSuggestion(pill)}
                className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedSuggestionChip === pill.label
                    ? 'bg-[#27374D] text-white border-[#27374D]'
                    : 'bg-[#DDE6ED]/60 text-[#27374D] border-[#9DB2BF]/60 hover:bg-[#9DB2BF]/30'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Speech Listening Banner & Error Messages */}
        {isListening && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center gap-2 animate-pulse">
            <Mic className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">🎙 Listening... Speak into your microphone. Recognized speech will be appended to your description box.</span>
          </div>
        )}

        {speechError && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Textarea */}
        <div className="space-y-1.5">
          <textarea
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your issue in your own words or click Voice Dictate..."
            className="w-full p-3 rounded-lg bg-[#DDE6ED]/30 border border-[#9DB2BF] text-[#27374D] text-xs sm:text-sm focus:border-[#27374D] focus:bg-white focus:outline-none transition-all placeholder:text-[#526D82]/60"
          />
        </div>

        {/* TOOLBAR: VOICE DICTATE + ADD IMAGE */}
        <div className="space-y-2 pt-2 border-t border-[#DDE6ED]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {/* Voice Dictate Toolbar Button */}
              <button
                type="button"
                onClick={handleToggleVoiceDictation}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                    : 'bg-[#DDE6ED]/70 hover:bg-[#9DB2BF]/40 text-[#27374D] border-[#9DB2BF]/60'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isListening ? '🎙 Listening...' : '🎙 Voice Dictate'}</span>
              </button>

              {/* Add Image Toolbar Button */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                multiple
                onChange={handleImageFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DDE6ED]/70 hover:bg-[#9DB2BF]/40 text-[#27374D] border border-[#9DB2BF]/60 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#526D82]" />
                <span>Add Image</span>
              </button>
            </div>

            <span className="text-[10px] text-[#526D82]">PNG, JPG, JPEG (Max 5MB • Voice / Image optional)</span>
          </div>

          {/* Image Validation Error */}
          {imageUploadError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <span>{imageUploadError}</span>
              <button onClick={() => setImageUploadError(null)} className="text-rose-600 font-bold hover:underline ml-2 cursor-pointer">
                Dismiss
              </button>
            </div>
          )}

          {/* Thumbnails of Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">
                Uploaded Attachments ({uploadedImages.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map(img => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-[#9DB2BF] bg-[#DDE6ED]/40 p-1 flex items-center gap-2">
                    <img src={img.url} alt={img.name} className="w-10 h-10 object-cover rounded" />
                    <div className="text-[11px] pr-5">
                      <p className="font-semibold text-[#27374D] truncate max-w-[100px]">{img.name}</p>
                      <span className="text-[9px] text-[#526D82] font-mono">{img.size} • Uploaded</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-700 text-white hover:bg-rose-800 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Analyze Issue Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={!prompt.trim() || analyzing}
            className={`w-full py-2.5 rounded-lg font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              !prompt.trim() || analyzing
                ? 'bg-[#9DB2BF]/60 text-[#526D82] cursor-not-allowed'
                : 'bg-[#27374D] hover:bg-[#1e2b3c] text-white'
            }`}
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#9DB2BF]" />
                <span>Running AI Triage & Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Analyze Issue & Run Diagnostics</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STEP 3: AI DIAGNOSIS & ACTIONABLE TRIAGE RESULTS */}
      {analysis && (
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
          {/* Header AI Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE6ED] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#27374D] text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
                  AI Triage Diagnosis
                </span>
              </div>
              <h2 className="text-base font-bold text-[#27374D]">{analysis.friendlyExplanation}</h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#DDE6ED] text-[#27374D]">
                {analysis.routingConfidence}% Match
              </span>
            </div>
          </div>

          {/* AI Category Conflict Warning if Detected vs Selected */}
          {analysis.problemType !== selectedProblemType && selectedProblemType !== 'unknown' && !dismissedConflict && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Category Hint Shift Detected</span>
                </div>
                <button
                  onClick={() => handleSwitchToDetectedCategory(analysis.problemType)}
                  className="px-2.5 py-1 rounded bg-amber-700 text-white font-bold hover:bg-amber-800 text-[10px] transition-colors cursor-pointer"
                >
                  Switch to {analysis.problemType === 'hardware' ? 'Hardware' : 'Software'}
                </button>
              </div>
              <p className="text-[11px] leading-relaxed">
                You selected <strong>{selectedProblemType === 'hardware' ? 'Hardware' : 'Software'}</strong>, but AI NLP analysis detected strong <strong>{analysis.problemType === 'hardware' ? 'Hardware' : 'Software'}</strong> indicators: <em>{analysis.problemTypeReasoning}</em>
              </p>
            </div>
          )}

          {/* Triage Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Category</span>
              <p className="font-bold text-[#27374D] mt-0.5 capitalize">{analysis.category.replace('_', ' ')}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">AI Difficulty</span>
              <div className="mt-0.5">
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                  analysis.difficulty === 'HARD' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  analysis.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {analysis.difficulty || 'MEDIUM'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Priority</span>
              <p className="font-bold text-[#27374D] mt-0.5 capitalize">{analysis.priority}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Assigned Team</span>
              <p className="font-bold text-[#27374D] mt-0.5">{analysis.routingRecommendation}</p>
            </div>
          </div>

          {/* AI Technical Reasoning & Summary */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              AI Technical Reasoning & Context Analysis
            </span>
            <p className="text-[#27374D] leading-relaxed">{analysis.technicalReasoning}</p>
          </div>

          {/* Suggested Resolution */}
          {analysis.suggestedResolution && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
              <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                AI Suggested Resolution
              </span>
              <p className="text-emerald-950 leading-relaxed font-medium">{analysis.suggestedResolution.text}</p>
            </div>
          )}

          {/* Recommended Knowledge Base Articles */}
          {analysis.recommendedArticles && analysis.recommendedArticles.length > 0 && (
            <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-2">
              <span className="text-[10px] font-mono text-blue-900 uppercase font-bold flex items-center gap-1">
                <Copy className="w-3.5 h-3.5 text-blue-700" />
                Recommended Knowledge Base Articles
              </span>
              <div className="space-y-1">
                {analysis.recommendedArticles.map((art, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#27374D] font-medium hover:underline cursor-pointer">
                    <span className="text-blue-600">📄</span>
                    <span>{art.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Next Steps: Self-Service Troubleshooting OR Confirm & Create Ticket */}
          <div className="pt-3 border-t border-[#DDE6ED] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleStartTroubleshooting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#526D82] hover:bg-[#27374D] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Run Guided AI Troubleshooting</span>
            </button>

            <button
              type="button"
              onClick={handleCreateTicketNow}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Confirm & Create Ticket</span>
            </button>
          </div>

          {/* Interactive Guided Troubleshooting Panel */}
          {troubleshootingActive && (
            <div className="mt-4 p-4 rounded-xl bg-[#DDE6ED]/40 border border-[#9DB2BF] space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#9DB2BF]/40 pb-2">
                <span className="text-xs font-bold text-[#27374D] uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#526D82]" />
                  <span>Guided Resolution Step {currentStepIndex + 1} of {analysis.suggestedTroubleshooting.length}</span>
                </span>
              </div>

              {analysis.suggestedTroubleshooting[currentStepIndex] && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#27374D]">
                    {analysis.suggestedTroubleshooting[currentStepIndex].title}
                  </h3>
                  <p className="text-xs text-[#526D82] leading-relaxed">
                    {analysis.suggestedTroubleshooting[currentStepIndex].instruction}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={handleExecuteStep}
                      disabled={stepRunning}
                      className="px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {stepRunning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing Diagnostics...</span>
                        </>
                      ) : (
                        <>
                          <span>{analysis.suggestedTroubleshooting[currentStepIndex].actionLabel}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleMarkSelfServiceResolved}
                      className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      Issue Resolved!
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
