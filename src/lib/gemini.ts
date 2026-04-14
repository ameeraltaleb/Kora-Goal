import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function summarizeNews(rawContent: string) {
  const prompt = `
    أنت خبير في الصحافة الرياضية ومنصة "كورة غول". 
    قم بتلخيص المحتوى التالي في فقرة واحدة مشوقة جداً باللغة العربية.
    اجعل العنوان يبدأ بـ "عاجل" أو "رسمياً" إذا كان الخبر يقتضي ذلك.
    المحتوى: ${rawContent}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error in summarizeNews:", error);
    throw new Error("فشل الذكاء الاصطناعي في الاستجابة. يرجى المحاولة لاحقاً.");
  }
}
