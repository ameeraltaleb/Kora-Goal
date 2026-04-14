const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  const envPath = path.resolve('.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  let apiKey = '';
  
  envContent.split(/\r?\n/).forEach(line => {
    if (line.startsWith('GEMINI_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
    }
  });

  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env.local");
    return;
  }

  console.log("Testing Gemini API with the provided key...");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const rawContent = "أعلن نادي ريال مدريد في بيان رسمي أنه سيوقع غدا مع اللاعب كيليان مبابي لتعزيز صفوفه في الموسم القادم. وقد أكد المدرب كارلو أنشيلوتي سعادته بهذه الصفقة الضخمة التي ستنقل الفريق لمستوى آخر في دوري الأبطال.";

  const prompt = `
    أنت خبير في الصحافة الرياضية ومنصة "كورة غول". 
    قم بتلخيص المحتوى التالي في فقرة واحدة مشوقة جداً باللغة العربية.
    اجعل العنوان يبدأ بـ "عاجل" أو "رسمياً" إذا كان الخبر يقتضي ذلك.
    المحتوى: ${rawContent}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("\n--- AI Result ---");
    console.log(response.text());
    console.log("-----------------");
  } catch (error) {
    console.error("AI Error:", error);
  }
}

testGemini();
