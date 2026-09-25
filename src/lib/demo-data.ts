import type { Listing, PriceSnapshot, Language } from "@/lib/types";

const latest = "2026-09-25";

export const DEMO_PRICES: PriceSnapshot[] = [
  { crop: "Onion", market: "Nashik APMC", price: 2180, previousPrice: 1960, trend: 11.2, unit: "quintal", date: latest, source: "APMC daily bulletin", history: [1960, 2010, 2050, 2100, 2060, 2120, 2180] },
  { crop: "Tomato", market: "Nashik APMC", price: 2840, previousPrice: 2540, trend: 11.8, unit: "quintal", date: latest, source: "APMC daily bulletin", history: [2540, 2600, 2650, 2720, 2690, 2780, 2840] },
  { crop: "Wheat", market: "Pune APMC", price: 2525, previousPrice: 2480, trend: 1.8, unit: "quintal", date: latest, source: "APMC daily bulletin", history: [2480, 2490, 2500, 2510, 2505, 2520, 2525] },
  { crop: "Cotton", market: "Nagpur APMC", price: 7240, previousPrice: 6980, trend: 3.7, unit: "quintal", date: latest, source: "APMC daily bulletin", history: [6980, 7020, 7060, 7100, 7150, 7200, 7240] },
  { crop: "Soybean", market: "Nashik APMC", price: 4530, previousPrice: 4390, trend: 3.2, unit: "quintal", date: latest, source: "APMC daily bulletin", history: [4390, 4410, 4440, 4470, 4500, 4510, 4530] },
  { crop: "Potato", market: "Pune APMC", price: 1780, previousPrice: 1650, trend: 7.9, unit: "quintal", date: latest, source: "APMC daily bulletin", history: [1650, 1680, 1700, 1720, 1740, 1760, 1780] },
];

export const DEMO_LISTINGS: Listing[] = [
  { id: "demo-1", farmer_name: "Sanjay Patil", crop: "Onion", quantity: 32, price: 2150, location: "Niphad, Nashik", phone: "919820000001", created_at: latest },
  { id: "demo-2", farmer_name: "Meera Jadhav", crop: "Soybean", quantity: 18, price: 4480, location: "Katol, Nagpur", phone: "919820000002", created_at: latest },
  { id: "demo-3", farmer_name: "Ramesh Shinde", crop: "Tomato", quantity: 12, price: 2780, location: "Junnar, Pune", phone: "919820000003", created_at: latest },
  { id: "demo-4", farmer_name: "Govind Wagh", crop: "Cotton", quantity: 45, price: 7100, location: "Yavatmal, Amravati", phone: "919820000004", created_at: latest },
  { id: "demo-5", farmer_name: "Anita Deshmukh", crop: "Wheat", quantity: 25, price: 2500, location: "Parbhani, Aurangabad", phone: "919820000005", created_at: latest },
  { id: "demo-6", farmer_name: "Raju More", crop: "Potato", quantity: 60, price: 1750, location: "Baramati, Pune", phone: "919820000006", created_at: latest },
  { id: "demo-7", farmer_name: "Priya Gaikwad", crop: "Brinjal", quantity: 15, price: 1400, location: "Sangamner, Nashik", phone: "919820000007", created_at: latest },
  { id: "demo-8", farmer_name: "Vitthal Kadam", crop: "Cauliflower", quantity: 20, price: 2400, location: "Satara, Kolhapur", phone: "919820000008", created_at: latest },
  { id: "demo-9", farmer_name: "Sunita Bhosle", crop: "Cabbage", quantity: 30, price: 1300, location: "Kolhapur APMC", phone: "919820000009", created_at: latest },
  { id: "demo-10", farmer_name: "Mahadev Pawar", crop: "Onion", quantity: 50, price: 2200, location: "Lasalgaon, Nashik", phone: "919820000010", created_at: latest },
];

export type BuyerDemandEntry = {
  buyer: string;
  crop: string;
  quantity: string;
  offer: number;
  location: string;
};

export const BUYER_DEMAND: BuyerDemandEntry[] = [
  { buyer: "Sahyadri Fresh Foods", crop: "Tomato", quantity: "60 qtl", offer: 3180, location: "Pune collection centre" },
  { buyer: "Deccan Agro Traders", crop: "Onion", quantity: "100 qtl", offer: 4050, location: "Nashik APMC" },
  { buyer: "Vidarbha Cotton Co-op", crop: "Cotton", quantity: "80 qtl", offer: 7420, location: "Nagpur APMC" },
  { buyer: "Maharashtra Agri Export", crop: "Soybean", quantity: "50 qtl", offer: 4600, location: "Aurangabad APMC" },
  { buyer: "Pune Sabji Mandai Group", crop: "Potato", quantity: "40 qtl", offer: 1800, location: "Pune APMC" },
  { buyer: "Kolhapur Sugarcane Union", crop: "Cabbage", quantity: "35 qtl", offer: 1500, location: "Kolhapur APMC" },
  { buyer: "Nashik Grape Export Ltd", crop: "Cauliflower", quantity: "25 qtl", offer: 2600, location: "Nashik APMC" },
  { buyer: "Amravati Kisan Sangh", crop: "Wheat", quantity: "70 qtl", offer: 2550, location: "Amravati APMC" },
  { buyer: "Latur Pulse Traders", crop: "Brinjal", quantity: "30 qtl", offer: 1600, location: "Latur APMC" },
  { buyer: "Solapur Farm Direct", crop: "Onion", quantity: "90 qtl", offer: 4100, location: "Solapur APMC" },
];

export const CROPS = ["Onion", "Tomato", "Wheat", "Cotton", "Soybean", "Potato"];
export const MARKETS = ["Nashik APMC", "Pune APMC", "Nagpur APMC", "Aurangabad APMC"];

/* ──── Crop name translations ──── */
const cropNames: Record<string, Record<Language, string>> = {
  "Onion":                  { english: "Onion",          hindi: "प्याज़",           marathi: "कांदा" },
  "Tomato":                 { english: "Tomato",         hindi: "टमाटर",          marathi: "टोमॅटो" },
  "Wheat":                  { english: "Wheat",          hindi: "गेहूँ",            marathi: "गहू" },
  "Cotton":                 { english: "Cotton",         hindi: "कपास",           marathi: "कापूस" },
  "Soybean":                { english: "Soybean",        hindi: "सोयाबीन",        marathi: "सोयाबीन" },
  "Potato":                 { english: "Potato",         hindi: "आलू",            marathi: "बटाटा" },
  "Brinjal":                { english: "Brinjal",        hindi: "बैंगन",           marathi: "वांगे" },
  "Cauliflower":            { english: "Cauliflower",    hindi: "फूलगोभी",        marathi: "फुलकोबी" },
  "Cabbage":                { english: "Cabbage",        hindi: "पत्तागोभी",      marathi: "कोबी" },
  "Maize":                  { english: "Maize",          hindi: "मक्का",           marathi: "मका" },
  "Ginger(Green)":          { english: "Green Ginger",   hindi: "हरी अदरक",       marathi: "ओला आले" },
  "Bitter gourd":           { english: "Bitter Gourd",   hindi: "करेला",          marathi: "कारले" },
  "French Beans(Frasbean)": { english: "French Beans",   hindi: "फ्रेंच बीन्स",    marathi: "फ्रेंच बीन्स" },
  "Guar":                   { english: "Cluster Beans",  hindi: "ग्वार",           marathi: "गवार" },
  "Chilly Capsicum":        { english: "Capsicum",       hindi: "शिमला मिर्च",    marathi: "ढोबळी मिरची" },
  "Bhindi(Ladies Finger)":  { english: "Okra",           hindi: "भिंडी",           marathi: "भेंडी" },
  "Cucumbar(Kheera)":       { english: "Cucumber",       hindi: "खीरा",           marathi: "काकडी" },
  "Sugarcane":              { english: "Sugarcane",      hindi: "गन्ना",           marathi: "ऊस" },
  "Bajra(Pearl Millet/Cumbu)": { english: "Pearl Millet", hindi: "बाजरा",        marathi: "बाजरी" },
  "Jowar(Sorghum)":         { english: "Sorghum",        hindi: "ज्वार",           marathi: "ज्वारी" },
  "Grapes":                 { english: "Grapes",         hindi: "अंगूर",           marathi: "द्राक्ष" },
  "Banana":                 { english: "Banana",         hindi: "केला",            marathi: "केळे" },
  "Chilli(Green)":          { english: "Green Chilli",   hindi: "हरी मिर्च",      marathi: "हिरवी मिरची" },
  "Groundnut":              { english: "Groundnut",      hindi: "मूँगफली",         marathi: "भुईमूग" },
};

export function translateCrop(crop: string, lang: Language): string {
  return cropNames[crop]?.[lang] ?? crop;
}

/* ──── Static UI label translations ──── */
type UIStrings = Record<string, Record<Language, string>>;

const uiStrings: UIStrings = {
  // Navigation
  "Dashboard":         { english: "Dashboard",         hindi: "डैशबोर्ड",        marathi: "डॅशबोर्ड" },
  "Price Board":       { english: "Price Board",       hindi: "मूल्य बोर्ड",     marathi: "किंमत बोर्ड" },
  "Market Linkage":    { english: "Market Linkage",    hindi: "बाज़ार संपर्क",    marathi: "बाजार संपर्क" },
  "SMS Service":       { english: "SMS Service",       hindi: "SMS सेवा",        marathi: "SMS सेवा" },
  "Account":           { english: "Account",           hindi: "खाता",            marathi: "खाते" },
  // Home
  "Market Assistant":  { english: "Market Assistant",  hindi: "बाज़ार सहायक",    marathi: "बाजार सहाय्यक" },
  "Market records":    { english: "Market records",    hindi: "बाज़ार रिकॉर्ड्स", marathi: "बाजार नोंदी" },
  "Buyer requests":    { english: "Buyer requests",    hindi: "खरीदार अनुरोध",   marathi: "खरेदीदार विनंत्या" },
  "Verified sellers":  { english: "Verified sellers",  hindi: "सत्यापित विक्रेता", marathi: "सत्यापित विक्रेते" },
  "Today's crop prices": { english: "Today's crop prices", hindi: "आज के फसल भाव", marathi: "आजचे पिकांचे भाव" },
  "Maharashtra weighted market average": { english: "Maharashtra weighted market average", hindi: "महाराष्ट्र भारित बाज़ार औसत", marathi: "महाराष्ट्र भारित बाजार सरासरी" },
  "All prices":        { english: "All prices",        hindi: "सभी भाव",         marathi: "सर्व भाव" },
  "Find a buyer":      { english: "Find a buyer",      hindi: "खरीदार खोजें",    marathi: "खरेदीदार शोधा" },
  "Live demand from local traders": { english: "Live demand from local traders", hindi: "स्थानीय व्यापारियों की लाइव माँग", marathi: "स्थानिक व्यापाऱ्यांची थेट मागणी" },
  "Net return":        { english: "Net return",        hindi: "शुद्ध आय",        marathi: "निव्वळ उत्पन्न" },
  "Calculate travel & packing costs": { english: "Calculate travel & packing costs", hindi: "यात्रा और पैकिंग लागत की गणना करें", marathi: "वाहतूक आणि पॅकिंग खर्च मोजा" },
  "Talk to assistant": { english: "Talk to assistant", hindi: "सहायक से बात करें", marathi: "सहाय्यकाशी बोला" },
  "Open":              { english: "Open",              hindi: "खोलें",            marathi: "उघडा" },
  // Advisor
  "Market assistant":  { english: "Market assistant",  hindi: "बाज़ार सहायक",    marathi: "बाजार सहाय्यक" },
  "Ask about prices, buyers, selling time, storage, or transport.": { english: "Ask about prices, buyers, selling time, storage, or transport.", hindi: "भाव, खरीदार, बिक्री का समय, भंडारण या परिवहन के बारे में पूछें।", marathi: "भाव, खरेदीदार, विक्रीची वेळ, साठवण किंवा वाहतुकीबद्दल विचारा." },
  "Should I sell today?": { english: "Should I sell today?", hindi: "क्या आज बेचना चाहिए?", marathi: "आज विकावे का?" },
  "What price should I ask buyers?": { english: "What price should I ask buyers?", hindi: "खरीदारों से कितना भाव माँगूँ?", marathi: "खरेदीदारांना किती भाव सांगावा?" },
  "Is storage worth the cost?": { english: "Is storage worth the cost?", hindi: "क्या भंडारण की लागत उचित है?", marathi: "साठवणुकीचा खर्च योग्य आहे का?" },
  "Ask a market question…": { english: "Ask a market question…", hindi: "बाज़ार संबंधी प्रश्न पूछें…", marathi: "बाजाराबद्दल प्रश्न विचारा…" },
  "Advice is informational. Verify live offers and weigh quality, transport, and storage before you sell.": { english: "Advice is informational. Verify live offers and weigh quality, transport, and storage before you sell.", hindi: "यह सलाह सूचनात्मक है। बिक्री से पहले लाइव ऑफर, गुणवत्ता, परिवहन और भंडारण की जाँच करें।", marathi: "ही सल्ला माहितीपूर्ण आहे. विकण्यापूर्वी थेट ऑफर, गुणवत्ता, वाहतूक आणि साठवण तपासा." },
  // Price Board
  "Mandi price board": { english: "Mandi price board", hindi: "मंडी मूल्य बोर्ड", marathi: "मंडी किंमत बोर्ड" },
  "Daily prices averaged across reporting markets": { english: "Daily prices averaged across reporting markets", hindi: "रिपोर्टिंग बाज़ारों का दैनिक औसत भाव", marathi: "अहवाल देणाऱ्या बाजारांचा दैनिक सरासरी भाव" },
  "per quintal":       { english: "per quintal",       hindi: "प्रति क्विंटल",    marathi: "प्रति क्विंटल" },
  // Calculator
  "Net return calculator": { english: "Net return calculator", hindi: "शुद्ध आय कैलकुलेटर", marathi: "निव्वळ उत्पन्न कॅल्क्युलेटर" },
  "Estimate your sale value before you transport.": { english: "Estimate your sale value before you transport.", hindi: "परिवहन से पहले अपनी बिक्री का अनुमान लगाएँ।", marathi: "वाहतुकीपूर्वी तुमच्या विक्रीचा अंदाज लावा." },
  "Crop":              { english: "Crop",              hindi: "फसल",            marathi: "पीक" },
  "Quantity (qtl)":    { english: "Quantity (qtl)",    hindi: "मात्रा (क्विं.)",  marathi: "प्रमाण (क्विं.)" },
  "Distance (km)":     { english: "Distance (km)",     hindi: "दूरी (कि.मी.)",   marathi: "अंतर (कि.मी.)" },
  "Gross sale value":  { english: "Gross sale value",  hindi: "कुल बिक्री मूल्य", marathi: "एकूण विक्री मूल्य" },
  "Transport (₹8/km)": { english: "Transport (₹8/km)", hindi: "परिवहन (₹8/कि.मी.)", marathi: "वाहतूक (₹8/कि.मी.)" },
  "Packing (5%)":      { english: "Packing (5%)",      hindi: "पॅकिंग (5%)",      marathi: "पॅकिंग (5%)" },
  "Expected net return": { english: "Expected net return", hindi: "अपेक्षित शुद्ध आय", marathi: "अपेक्षित निव्वळ उत्पन्न" },
  // Market Linkage
  "Market linkage":    { english: "Market linkage",    hindi: "बाज़ार संपर्क",    marathi: "बाजार संपर्क" },
  "Verified buyer demand and farmer supply in one place.": { english: "Verified buyer demand and farmer supply in one place.", hindi: "सत्यापित खरीदार माँग और किसान आपूर्ति एक जगह।", marathi: "सत्यापित खरेदीदार मागणी आणि शेतकरी पुरवठा एकाच ठिकाणी." },
  "Buyer demand":      { english: "Buyer demand",      hindi: "खरीदार माँग",     marathi: "खरेदीदार मागणी" },
  "Farmer supply":     { english: "Farmer supply",     hindi: "किसान आपूर्ति",   marathi: "शेतकरी पुरवठा" },
  "List crop":         { english: "List crop",         hindi: "फसल सूचीबद्ध करें", marathi: "पीक सूचीबद्ध करा" },
  "Verified":          { english: "Verified",          hindi: "सत्यापित",         marathi: "सत्यापित" },
  "offer / qtl":       { english: "offer / qtl",       hindi: "ऑफर / क्विं.",     marathi: "ऑफर / क्विं." },
  "Request buyer contact": { english: "Request buyer contact", hindi: "खरीदार संपर्क माँगें", marathi: "खरेदीदार संपर्क मागा" },
  "Contact farmer":    { english: "Contact farmer",    hindi: "किसान से संपर्क करें", marathi: "शेतकऱ्याशी संपर्क करा" },
  "Publish your crop": { english: "Publish your crop", hindi: "अपनी फसल प्रकाशित करें", marathi: "तुमचे पीक प्रकाशित करा" },
  "Available for nearby verified buyers": { english: "Available for nearby verified buyers", hindi: "पास के सत्यापित खरीदारों के लिए उपलब्ध", marathi: "जवळच्या सत्यापित खरेदीदारांसाठी उपलब्ध" },
  "Farmer name":       { english: "Farmer name",       hindi: "किसान का नाम",    marathi: "शेतकऱ्याचे नाव" },
  "Village / district": { english: "Village / district", hindi: "गाँव / ज़िला",    marathi: "गाव / जिल्हा" },
  "WhatsApp number":   { english: "WhatsApp number",   hindi: "WhatsApp नंबर",   marathi: "WhatsApp क्रमांक" },
  "Publish crop listing": { english: "Publish crop listing", hindi: "फसल सूची प्रकाशित करें", marathi: "पीक सूची प्रकाशित करा" },
  "Expected ₹ / qtl":  { english: "Expected ₹ / qtl",  hindi: "अपेक्षित ₹ / क्विं.", marathi: "अपेक्षित ₹ / क्विं." },
  "Listing published for buyers in your region.": { english: "Listing published for buyers in your region.", hindi: "आपकी सूची आपके क्षेत्र के खरीदारों के लिए प्रकाशित हो गई।", marathi: "तुमची सूची तुमच्या क्षेत्रातील खरेदीदारांसाठी प्रकाशित झाली." },
  "Marketplace data is temporarily unavailable.": { english: "Marketplace data is temporarily unavailable.", hindi: "बाज़ार डेटा अस्थायी रूप से अनुपलब्ध है।", marathi: "बाजार डेटा तात्पुरता अनुपलब्ध आहे." },
  // SMS
  "SMS market service": { english: "SMS market service", hindi: "SMS बाज़ार सेवा", marathi: "SMS बाजार सेवा" },
  "Farmers can text a crop name to receive one latest price.": { english: "Farmers can text a crop name to receive one latest price.", hindi: "किसान एक फसल का नाम लिखकर नवीनतम भाव प्राप्त कर सकते हैं।", marathi: "शेतकरी पिकाचे नाव लिहून नवीनतम भाव मिळवू शकतात." },
  "SMS integration is active": { english: "SMS integration is active", hindi: "SMS एकीकरण सक्रिय है", marathi: "SMS एकीकरण सक्रिय आहे" },
  "Type a crop name…":  { english: "Type a crop name…", hindi: "फसल का नाम लिखें…", marathi: "पिकाचे नाव लिहा…" },
  // Profile
  "Profile":           { english: "Profile",           hindi: "प्रोफ़ाइल",        marathi: "प्रोफाइल" },
  "Manage your KisanSetu farm profile & language preferences.": { english: "Manage your KisanSetu farm profile & language preferences.", hindi: "अपनी KisanSetu कृषि प्रोफ़ाइल और भाषा प्राथमिकताएँ प्रबंधित करें।", marathi: "तुमची KisanSetu शेती प्रोफाइल आणि भाषा प्राधान्ये व्यवस्थापित करा." },
  "Name":              { english: "Name",              hindi: "नाम",             marathi: "नाव" },
  "Village":           { english: "Village",           hindi: "गाँव",             marathi: "गाव" },
  "Taluka":            { english: "Taluka",            hindi: "तालुका",           marathi: "तालुका" },
  "District":          { english: "District",          hindi: "ज़िला",            marathi: "जिल्हा" },
  "Language":          { english: "Language",          hindi: "भाषा",            marathi: "भाषा" },
  "Save profile":      { english: "Save profile",      hindi: "प्रोफ़ाइल सहेजें", marathi: "प्रोफाइल जतन करा" },
  "Saving…":           { english: "Saving…",           hindi: "सहेज रहे हैं…",   marathi: "जतन करत आहे…" },
  "Saved":             { english: "Saved",             hindi: "सहेजा गया",       marathi: "जतन केले" },
  "Logout":            { english: "Logout",            hindi: "लॉगआउट",         marathi: "लॉगआउट" },
  "Verified Farm Account": { english: "Verified Farm Account", hindi: "सत्यापित कृषि खाता", marathi: "सत्यापित शेती खाते" },
  // Common
  "crops":             { english: "crops",             hindi: "फ़सलें",           marathi: "पिके" },
  "open":              { english: "open",              hindi: "खुले",             marathi: "उघडे" },
  "active":            { english: "active",            hindi: "सक्रिय",          marathi: "सक्रिय" },
  "from":              { english: "from",              hindi: "से",               marathi: "कडून" },
  "qtl":               { english: "qtl",               hindi: "क्विं.",           marathi: "क्विं." },
};

export function t(key: string, lang: Language): string {
  return uiStrings[key]?.[lang] ?? key;
}

/* ──── Crop image path helper ──── */
const cropImageMap: Record<string, string> = {
  "Onion": "/crops/onion.jpg",
  "Tomato": "/crops/tomato.jpg",
  "Wheat": "/crops/wheat.jpg",
  "Cotton": "/crops/cotton.jpg",
  "Soybean": "/crops/soybean.jpg",
  "Potato": "/crops/potato.jpg",
};

export function getCropImage(crop: string): string | null {
  return cropImageMap[crop] ?? null;
}
