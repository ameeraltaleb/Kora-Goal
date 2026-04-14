import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function summarizeNews(rawContent: string): Promise<{title: string, content: string}> {
  const prompt = `
    أنت خبير في الصحافة الرياضية ومنصة "كورة غول". 
    استخرج عنواناً جذاباً (يبدأ بـ "عاجل" أو "رسمياً" إذا لزم الأمر)، وقم بتلخيص المحتوى التالي في فقرة واحدة مشوقة جداً باللغة العربية.
    يجب أن تكون مخرجاتك بتنسيق JSON حصراً:
    {"title": "العنوان هنا", "content": "التلخيص هنا"}
    
    المحتوى:
    ${rawContent}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Error in summarizeNews:", error);
    // Fallback if parsing fails
    throw new Error("فشل الذكاء الاصطناعي في الاستجابة. يرجى المحاولة لاحقاً.");
  }
}
