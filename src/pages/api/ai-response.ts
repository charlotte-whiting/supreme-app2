import type { NextApiRequest } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt =
    "Give me a short paragraph prompt that would be given in a college history course";

  const result = await model.generateContent(prompt);

  res.status(200).json({ message: result.response.text() });
}
