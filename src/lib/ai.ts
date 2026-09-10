import { Language } from './types';

// ─── Canned AI recommendations ───────────────────────────────────
// Structured so the function signature stays identical when swapping
// to a real Groq Llama-3 API call. Only the function body changes.

interface AdviceRequest {
  crop: string;
  price: number;
  trend: number; // percentage
  language: Language;
}

const CANNED_ADVICE: Record<string, Record<Language, string>> = {
  Onion: {
    hindi: 'प्याज की कीमत बढ़ रही है। अभी बेचना फायदेमंद रहेगा, 2-3 दिन में और तेजी आ सकती है।',
    marathi: 'कांद्याचा भाव वाढत आहे. आता विकणे फायदेशीर आहे, 2-3 दिवसात आणखी वाढ होऊ शकते.',
    english: 'Onion prices are rising. Selling now is profitable — expect a further 2-3 day uptick in demand.',
  },
  Tomato: {
    hindi: 'टमाटर की कीमत गिर रही है। स्टॉक रखें और 4-5 दिन बाद बेचें, सप्लाई कम होने पर भाव सुधरेगा।',
    marathi: 'टोमॅटोचा भाव घसरत आहे. साठवून ठेवा आणि 4-5 दिवसांनी विका, पुरवठा कमी झाल्यावर भाव सुधारेल.',
    english: 'Tomato prices are dropping. Hold stock and sell in 4-5 days — supply tightening should push prices back up.',
  },
  Wheat: {
    hindi: 'गेहूं का भाव स्थिर है। MSP से ऊपर है, सरकारी खरीद केंद्र पर बेचना सुरक्षित विकल्प है।',
    marathi: 'गव्हाचा भाव स्थिर आहे. MSP पेक्षा जास्त आहे, सरकारी खरेदी केंद्रावर विकणे सुरक्षित पर्याय आहे.',
    english: 'Wheat prices are stable, above MSP. Selling at government procurement centers is a safe option right now.',
  },
  Cotton: {
    hindi: 'कपास की कीमत में गिरावट है। अभी बेचने से बचें, त्योहारी सीजन में मांग बढ़ने की संभावना है।',
    marathi: 'कापसाचा भाव घसरत आहे. आता विकणे टाळा, सणासुदीच्या हंगामात मागणी वाढण्याची शक्यता आहे.',
    english: 'Cotton prices are dipping. Avoid selling now — festive season demand should push prices higher.',
  },
  Soybean: {
    hindi: 'सोयाबीन की कीमत तेजी में है। निर्यात मांग मजबूत है, जल्द बेचना फायदेमंद होगा।',
    marathi: 'सोयाबीनचा भाव वाढत आहे. निर्यात मागणी मजबूत आहे, लवकर विकणे फायदेशीर ठरेल.',
    english: 'Soybean prices are trending up. Export demand is strong — selling soon would be profitable.',
  },
  Potato: {
    hindi: 'आलू का भाव गिर रहा है। कोल्ड स्टोरेज में रखें, 2 हफ्ते बाद भाव बढ़ने की उम्मीद है।',
    marathi: 'बटाट्याचा भाव घसरत आहे. कोल्ड स्टोरेजमध्ये ठेवा, 2 आठवड्यांनी भाव वाढण्याची अपेक्षा आहे.',
    english: 'Potato prices are falling. Use cold storage — prices are expected to recover in about 2 weeks.',
  },
};

/**
 * Get AI-powered crop selling advice.
 *
 * To wire Groq Llama-3: replace the body with a fetch() call to
 * https://api.groq.com/openai/v1/chat/completions using the
 * GROQ_API_KEY env var. The prompt should be:
 *   "Given {crop} at ₹{price}/quintal with {trend}% change,
 *    give a 2-sentence selling recommendation in {language},
 *    no more than 40 words."
 */
export async function getAdvice(
  crop: string,
  price: number,
  trend: number,
  language: Language
): Promise<string> {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 300));

  const cropAdvice = CANNED_ADVICE[crop];
  if (cropAdvice && cropAdvice[language]) {
    return cropAdvice[language];
  }

  // Fallback for unknown crops
  const fallback: Record<Language, string> = {
    hindi: `${crop} का वर्तमान भाव ₹${price}/क्विंटल है (${trend > 0 ? 'बढ़त' : 'गिरावट'} ${Math.abs(trend)}%)। बाजार की स्थिति देखकर फैसला लें।`,
    marathi: `${crop} चा सध्याचा भाव ₹${price}/क्विंटल आहे (${trend > 0 ? 'वाढ' : 'घट'} ${Math.abs(trend)}%). बाजाराची परिस्थिती पाहून निर्णय घ्या.`,
    english: `${crop} is currently at ₹${price}/quintal (${trend > 0 ? 'up' : 'down'} ${Math.abs(trend)}%). Monitor market conditions before deciding to sell.`,
  };

  return fallback[language];
}
