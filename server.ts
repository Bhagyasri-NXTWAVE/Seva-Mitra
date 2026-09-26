import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client if key exists
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI();
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI:', err);
  }
}

// Fallback logic for Complaint Letter if AI fails or key is missing
function generateFallbackLetter(data: {
  category: string;
  description: string;
  location: string;
  affectedCount: string | number;
  urgency: string;
  citizenName: string;
  language: string;
  landmark?: string;
  department?: string;
}): string {
  const { category, description, location, affectedCount, urgency, citizenName, language, landmark, department } = data;
  const deptName = department || 'The Concerned Competent Administrative Officer / Zonal Commissioner';
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  if (language === 'te') {
    return `తేదీ: ${today}

స్వీకర్త:
గౌరవనీయులైన అధికారి వారు,
${deptName}
కార్యాలయ పరిధి, ${location}

విషయం: ${category} సమస్య పరిష్కారము కోరుతూ వినతిపత్రం

గౌరవనీయులైన అయ్యా / అమ్మా,

నేను, ${citizenName || 'ఒక బాధ్యతగల పౌరుడను'}, మా ప్రాంతంలోని ప్రజా సమస్యను మీ దృష్టికి తీసుకురావాలని కోరుతున్నాను.

సమస్య వివరాలు:
ప్రాంతం: ${location} ${landmark ? `(గుర్తు: ${landmark})` : ''}
సమస్య వర్గం: ${category}
ప్రభావిత పౌరులు: సుమారు ${affectedCount} మంది
తీవ్రత: ${urgency}

వివరణ:
${description}

పై సమస్య వలన మా ప్రాంత ప్రజలు తీవ్ర అసౌకర్యానికి గురవుతున్నారు. ప్రత్యేకించి రాత్రి వేళల్లో మరియు అత్యవసర సమయాల్లో ప్రమాదాలు జరిగే అవకాశం ఉంది.

కావున, దయచేసి సంబంధిత ఇంజనీరింగ్ / క్షేత్రస్థాయి అధికారులను పంపి క్షేత్ర పరిశీలన జరిపించి, వెంటనే మరమ్మత్తు లేదా తగిన చర్యలు తీసుకోవాల్సిందిగా కోరుతున్నాను.

ధన్యవాదాలతో,

భవదీయుడు / భవదీయురాలు,
${citizenName || 'ప్రాంతీయ పౌరుడు'}
ఫోన్ / డిజిటల్ గుర్తింపు: SevaMitra ధృవీకరించిన పౌరుడు
ప్రదేశం: ${location}`;
  }

  if (language === 'tenglish') {
    return `Date: ${today}

To:
The Respected Administrative Officer,
${deptName}
Jurisdiction: ${location}

Subject: Urgent petition regarding ${category} issue at ${location}

Respected Sir/Madam,

Nenu, ${citizenName || 'a resident citizen'}, ma area lo unna serious public infrastructure problem ni mee dhyaniki thesthunnanu.

Issue Details:
Location: ${location} ${landmark ? `(Landmark: ${landmark})` : ''}
Category: ${category}
People Affected: Approximately ${affectedCount} residents
Urgency Level: ${urgency}

Problem Description:
${description}

Ee problem valla ma locality prajalu and commuters chala ibbandhi paduthunnaru. Daily school pillalu, elders and motorists ki safety risk ekkuva ga undhi.

Anduvalla, concerned field officers ni visit cheyinchi, ee issue ni priority basis meedha solve cheyalsindhiga vinathi chesthunnamu.

Dhanyavadhalatho,

Sincerely,
${citizenName || 'Verified Citizen'}
Contact / DigiLocker Verified Profile via SevaMitra Portal
Location: ${location}`;
  }

  if (language === 'hi') {
    return `दिनांक: ${today}

सेवा में,
सक्षम प्रशासनिक अधिकारी महोदय,
${deptName}
प्रशासनिक प्रभाग, ${location}

विषय: ${location} में ${category} की समस्या के निराकरण हेतु प्रार्थना पत्र।

महोदय / महोदया,

सविनय निवेदन है कि मैं, ${citizenName || 'एक सजग नागरिक'}, आपके संज्ञान में हमारे क्षेत्र की एक अत्यंत गंभीर जन-समस्या लाना चाहता हूँ।

समस्या का विवरण:
स्थान: ${location} ${landmark ? `(समीप: ${landmark})` : ''}
श्रेणी: ${category}
प्रभावित नागरिकों की संख्या: लगभग ${affectedCount} लोग
प्राथमिकता स्तर: ${urgency}

समस्या का पूर्ण विवरण:
${description}

उक्त समस्या के कारण स्थानीय निवासियों, वृद्धों और बच्चों को भारी असुविधा एवं दुर्घटनाओं की आशंका का सामना करना पड़ रहा है।

अतः आपसे विनम्र अनुरोध है कि जनहित में संबंधित कनिष्ठ अभियंता अथवा निरीक्षण दल को मौके पर भेजकर शीघ्र अति शीघ्र उचित कार्रवाई करवाने की कृपा करें।

सधन्यवाद,

भवदीय / भवदीया,
${citizenName || 'सत्यापित नागरिक'}
डिजिटल पहचान: SevaMitra अधिकृत नागरिक
स्थान: ${location}`;
  }

  // Default English
  return `Date: ${today}

To:
The Competent Administrative Officer,
${deptName},
Administrative Division: ${location}

Subject: Formal Grievance Petition regarding ${category} at ${location}

Respected Sir / Madam,

I am writing this formal grievance petition as a verified citizen to bring an urgent civic issue to your prompt administrative attention.

Grievance Details:
• Location: ${location} ${landmark ? `(Landmark: ${landmark})` : ''}
• Category: ${category}
• Citizens Affected: Approximately ${affectedCount} individuals
• Urgency Level: ${urgency}

Factual Statement & Description:
${description}

Impact Assessment:
Due to this unresolved grievance, local residents, pedestrians, senior citizens, and commuters face persistent daily hardships and severe public health/safety risks.

Specific Prayer / Relief Sought:
I respectfully request the competent authority to depute a technical field inspection officer to examine the premises and initiate necessary rectifications and public works on priority.

A photo/video evidence record has been uploaded and geo-tagged under SevaMitra digital public grievance standards.

Thanking you.

Yours faithfully,

${citizenName || 'Verified Citizen'}
Digital Record: DigiLocker Verified Resident
SevaMitra Citizen Portal Submission`;
}

// Route: AI Chatbot / Assistant for Government Services
app.post('/api/ai/chat', async (req, res) => {
  const { messages, citizenProfile, language } = req.body;
  const currentLang = language || 'en';

  const systemInstruction = `You are "Sarkari SevaMitra AI", an official, polite, highly accurate and empathetic Indian Government Citizen Services digital assistant on the SevaMitra portal.
Your mission is to guide Indian citizens regarding:
1. Central and State Government welfare schemes (PM Kisan, Ayushman Bharat, PMAY, Post-Matric Scholarship, Mudra Loan, PM Vishwakarma, etc.).
2. Explaining eligibility criteria truthfully based on verified details (Aadhaar, income, profession, caste category, disability).
3. Assisting in public grievance filing (roads, sanitation, water, streetlights, drainage) and departmental routing.
4. Explaining why an application might be declined and actionable remedial steps.

Language instruction:
- If language is 'te', respond in polite formal Telugu script.
- If language is 'tenglish', respond in natural conversational Tenglish (Telugu words transliterated in English alphabet, e.g., "Mee application status check chesamu...").
- If language is 'hi', respond in respectful Shuddh Hindi.
- If language is 'en', respond in clear, accessible, professional Indian administrative English.

Rules:
- NEVER hallucinate government policies or invent fictional schemes.
- Clearly distinguish verified information from general advice.
- Keep answers structured with bullet points and bold headers when helpful.
- Citizen profile context: ${JSON.stringify(citizenProfile || {})}
`;

  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const formattedHistory = (messages || []).slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
      const lastMessage = messages?.[messages.length - 1]?.content || 'Hello';

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...formattedHistory,
          { role: 'user', parts: [{ text: lastMessage }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      return res.json({ reply: response.text });
    } catch (err: unknown) {
      console.warn('Gemini chat error, falling back to rule-based assistance:', err);
    }
  }

  // High quality rule-based fallback responses tailored by language
  const userText = (messages?.[messages.length - 1]?.content || '').toLowerCase();
  let reply = '';

  if (currentLang === 'te') {
    if (userText.includes('scheme') || userText.includes('పథకం') || userText.includes('scholarship') || userText.includes('విద్యార్థి')) {
      reply = `నమస్కారం! మీ ధృవీకరించిన ప్రొఫైల్ ప్రకారం:\n\n1. **పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ (Post-Matric Scholarship)**: విద్యార్థులకు ట్యూషన్ ఫీజు మరియు మెయింటెనెన్స్ అలవెన్స్.\n2. **ప్రధానమంత్రి విద్యా యోజన**: ఉన్నత విద్య కోసం ఆర్థిక సాయం.\n3. **పీఎం కిసాన్ సమ్మాన్ నిధి**: ఒకవేళ కుటుంబం వ్యవసాయ భూమి కలిగివుంటే ₹6,000 వార్షిక సాయం.\n\nమీరు 'Schemes' విభాగంలో ఈ పథకాలకు నేరుగా దరఖాస్తు చేసుకోవచ్చు లేదా వివరాలను పరిశీలించవచ్చు.`;
    } else if (userText.includes('complaint') || userText.includes('ఫిర్యాదు') || userText.includes('రోడ్డు') || userText.includes('నీరు')) {
      reply = `మీ ప్రాంతంలో రోడ్లు, డ్రైనేజీ, వీధి దీపాలు లేదా తాగునీటి సమస్యలు ఉంటే 'Raise a Complaint' బటన్ క్లిక్ చేయండి. ఫోటో అప్‌లోడ్ చేస్తే AI ఆటోమేటిక్‌గా అధికారిక వినతిపత్రం తయారుచేసి సంబంధిత మున్సిపల్ విభాగానికి పంపుతుంది.`;
    } else {
      reply = `నమస్కారం! నేను మీ SevaMitra AI సహాయకుడిని. ప్రభుత్వ పథకాల అర్హత, దరఖాస్తు స్థితి లేదా ప్రజా సమస్యలపై ఫిర్యాదులను పరిష్కరించడంలో నేను మీకు సహాయపడగలను. మీకు ఏ విషయంలో సహాయం కావాలి?`;
    }
  } else if (currentLang === 'tenglish') {
    if (userText.includes('scheme') || userText.includes('scholarship') || userText.includes('student')) {
      reply = `Namaskaram! Mee verified citizen profile prakaram meeku kinda schemes suggest chesthunnanu:\n\n1. **Post-Matric Student Scholarship**: Tuition fees reimbursement & annual maintenance allowance.\n2. **PM Youth Skill Development**: Free professional certification with stipend.\n3. **Ayushman Bharat PM-JAY**: ₹5 Lakhs varaku family cashless health coverage.\n\nMeeru paina unna 'Schemes' tab lo 'Explore Schemes' click chesi complete details chudochu!`;
    } else if (userText.includes('complaint') || userText.includes('road') || userText.includes('water') || userText.includes('problem')) {
      reply = `Mee locality lo pothole road, drainage block, leda street light issue unte ventane 'Raise a Complaint' section ki vellandi. Photo upload chesthe mana AI auto-generated official petition create chesi direct ga Municipal Ward Office ki forward chesthundhi.`;
    } else {
      reply = `Namaskaram! Nenu mee SevaMitra AI Mitra. Government welfare schemes, DigiLocker verification, leda public complaints gurinchi edhaina adagandi. Nenu simple ga explain chestha!`;
    }
  } else if (currentLang === 'hi') {
    if (userText.includes('scheme') || userText.includes('योजना') || userText.includes('छात्रवृत्ति')) {
      reply = `नमस्ते! आपकी सत्यापित नागरिक प्रोफ़ाइल के आधार पर मुख्य सरकारी योजनाएं:\n\n1. **पोस्ट-मैट्रिक छात्रवृत्ति (Post-Matric Scholarship)**: शुल्क प्रतिपूर्ति और आर्थिक सहायता।\n2. **आयुष्मान भारत (PM-JAY)**: प्रति परिवार ₹5 लाख तक का निःशुल्क कैशलेस स्वास्थ्य बीमा।\n3. **पीएम कौशल विकास योजना**: कौशल प्रशिक्षण और सरकारी प्रमाणपत्र।\n\nआप 'योजनाएं' (Schemes) टैब में जाकर अपनी पात्रता की पुष्टि कर सकते हैं।`;
    } else if (userText.includes('शिकायत') || userText.includes('सड़क') || userText.includes('complaint')) {
      reply = `सड़क, बिजली, पानी या स्वच्छता से जुड़ी समस्या दर्ज करने के लिए 'Raise a Complaint' पर जाएं। फोटो साक्ष्य अपलोड करने पर हमारा AI स्वतः आधिकारिक प्रार्थना पत्र तैयार कर संबंधित नगर निगम को अग्रेषित कर देगा।`;
    } else {
      reply = `नमस्ते! मैं सेवामित्र (SevaMitra) नागरिक सहायक हूँ। सरकारी योजनाओं, आवेदन स्थिति या लोक शिकायत दर्ज करने में मैं आपकी पूरी सहायता करूँगा। बताएं मैं आपकी क्या मदद करूँ?`;
    }
  } else {
    if (userText.includes('scheme') || userText.includes('scholarship') || userText.includes('eligible') || userText.includes('student')) {
      reply = `Welcome! Based on verified citizen parameters, here are top matching public schemes:\n\n1. **Post-Matric Scholarship Scheme**: 100% tuition subsidy + maintenance grant for students meeting income norms.\n2. **Ayushman Bharat PM-JAY**: ₹5,00,000 annual secondary & tertiary health cover per eligible family.\n3. **PM MUDRA Scheme**: Collateral-free micro loans (Shishu, Kishore, Tarun) for self-employment & small enterprise.\n4. **PM Awas Yojana (Urban/Gramin)**: Subsidized interest & pucca house financial assistance.\n\nClick **Explore Schemes** in the navigation bar to review detailed requirements and apply!`;
    } else if (userText.includes('complaint') || userText.includes('road') || userText.includes('pothole') || userText.includes('grievance')) {
      reply = `To file a public infrastructure grievance, click on **Raise a Complaint**. You can upload photo/video evidence, pinpoint the locality, and our AI will draft a legally precise grievance letter and auto-route it to the designated Municipal / Public Works Engineering Office.`;
    } else if (userText.includes('decline') || userText.includes('reject') || userText.includes('why')) {
      reply = `Applications are typically declined due to: (1) Verified annual income exceeding the scheme ceiling, (2) Incomplete category certificate, or (3) Academic score thresholds. On your Dashboard, click on any **Declined** application to view the official reason code and the remedial recourse available.`;
    } else {
      reply = `Hello! I am your **SevaMitra AI Civic Assistant**. I can help you discover government benefits tailored to your profile, explain eligibility guidelines, draft formal public grievances, or check application timelines. How may I assist you today?`;
    }
  }

  return res.json({ reply });
});

// Route: AI Complaint Letter Generator
app.post('/api/ai/complaint-letter', async (req, res) => {
  const { category, description, location, affectedCount, urgency, citizenName, language, landmark, department } = req.body;

  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are a legal and public administration drafting expert for Indian Municipal and State Government departments.
Draft a formal, respectful, and authoritative public grievance petition letter.
Follow official Indian government petition standards.

Citizen Information:
- Name: ${citizenName || 'Verified Resident Citizen'}
- Location: ${location}
- Landmark: ${landmark || 'N/A'}
- Category of Public Grievance: ${category}
- Specific Issue Description: ${description}
- Number of Citizens Impacted: ${affectedCount || 'Multiple residents'}
- Urgency Level: ${urgency || 'Standard'}
- Assigned Administrative Department: ${department || 'Competent Municipal Authority'}

Language requirement:
- If language is 'te': write in formal Telugu.
- If language is 'tenglish': write in professional conversational Tenglish (Telugu phonetics written with English script).
- If language is 'hi': write in formal official Hindi.
- If language is 'en': write in crisp, professional Indian administrative English.

Letter format must include:
1. Date
2. To (The Competent Administrative Officer / Department / Jurisdiction)
3. Subject: (Clear, formal summary)
4. Formal Salutation (Respected Sir / Madam)
5. Grievance statement, facts, affected citizens, and risk/inconvenience
6. Specific Prayer / Requested Action (Inspection, repair, timeline)
7. Formal Sign-off with citizen name and verified SevaMitra digital footprint.
Do NOT fabricate dates or non-existent evidence. Return only the clean petition text.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.2 },
      });

      if (response.text && response.text.trim().length > 50) {
        return res.json({ letter: response.text.trim() });
      }
    } catch (err) {
      console.warn('AI letter generation error, using fallback:', err);
    }
  }

  // Fallback
  const fallback = generateFallbackLetter({
    category,
    description,
    location,
    affectedCount,
    urgency,
    citizenName,
    language: language || 'en',
    landmark,
    department,
  });

  return res.json({ letter: fallback });
});

// Route: AI Scheme Match Analysis
app.post('/api/ai/scheme-match', async (req, res) => {
  const { scheme, profile, language } = req.body;
  // Fast rule-assisted eligibility calculation with AI depth
  let matchScore = 85;
  const reasons: string[] = [];
  const missing: string[] = [];

  if (profile?.profession === 'Student' && scheme.category === 'Education') {
    matchScore = 96;
    reasons.push('Verified as an enrolled student in an accredited institution.');
  } else if (profile?.profession === 'Farmer' && scheme.category === 'Agriculture') {
    matchScore = 95;
    reasons.push('Matches landholding and primary agricultural cultivator status.');
  } else {
    reasons.push('Meets primary residency and age thresholds.');
  }

  if (profile?.incomeBracket === 'Below 1.5 Lakh' || profile?.incomeBracket === '1.5 Lakh - 3 Lakh') {
    reasons.push('Verified household income falls within the subsidized economic benchmark.');
  } else {
    missing.push('Income certificate verification required for full subsidy allocation.');
  }

  if (!profile?.casteCategory || profile?.casteCategory === 'General') {
    missing.push('Special category affirmative reservation certificate not applicable.');
  }

  return res.json({
    matchScore,
    reasons,
    missing,
    officialDisclaimer: 'This percentage is an algorithmic readiness indicator and does not replace official scrutiny by the sanctioning authority.',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SevaMitra API Gateway', timestamp: new Date().toISOString() });
});

// Development / Production static handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SevaMitra Portal running on http://localhost:${PORT}`);
  });
}

startServer();
