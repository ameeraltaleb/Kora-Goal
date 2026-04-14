import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || "").trim());
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// 1. Queue to Limit Concurrency (Throttling)
class TaskQueue {
  private concurrency: number;
  private running: number;
  private queue: (() => void)[];

  constructor(concurrency: number) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        this.running++;
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.dequeue();
        }
      });
      this.dequeue();
    });
  }

  private dequeue() {
    if (this.running >= this.concurrency) return;
    const nextTask = this.queue.shift();
    if (nextTask) nextTask();
  }
}

// Global queue across this file to guarantee max 1 concurrent tasks at a time
const geminiQueue = new TaskQueue(1);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 2. Exponential Backoff & Main Logic
async function _summarizeNewsWithRetry(prompt: string, maxRetries = 3): Promise<{title: string, content: string}> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error: any) {
      attempt++;
      console.error(`AI Error in summarizeNews (Attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt >= maxRetries) {
        console.error("استنفدنا كل المحاولات، نتجاوز الذكاء الاصطناعي.");
        throw error;
      }

      // Check for HTTP 429 and parse exact 'retryDelay' from Google
      let waitTime = 5000 * Math.pow(2, attempt); // Base exponential backoff (10s, 20s...)
      
      const errorMessage = error.message || "";
      if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded")) {
        const match = errorMessage.match(/retry in ([\d\.]+)s/);
        if (match && match[1]) {
          waitTime = (parseFloat(match[1]) * 1000) + 1000; // Wait requested time + 1 sec buffer
        }
      }

      console.warn(`⏳ ننتظر ${Math.round(waitTime/1000)} ثانية قبل إعادة المحاولة لمعالجة الخبر...`);
      await delay(waitTime);
    }
  }
  
  throw new Error("فشل الذكاء الاصطناعي في الاستجابة نهائياً.");
}

export async function summarizeNews(rawContent: string): Promise<{title: string, content: string}> {
  const prompt = `
    أنت خبير في الصحافة الرياضية ومنصة "كورة غول". 
    استخرج عنواناً جذاباً (يبدأ بـ "عاجل" أو "رسمياً" إذا لزم الأمر)، وقم بتلخيص المحتوى التالي في فقرة واحدة مشوقة جداً باللغة العربية.
    يجب أن تكون مخرجاتك بتنسيق JSON حصراً:
    {"title": "العنوان هنا", "content": "التلخيص هنا"}
    
    المحتوى:
    ${rawContent}
  `;

  // Submit task to the throttling queue
  return geminiQueue.enqueue(() => _summarizeNewsWithRetry(prompt));
}
