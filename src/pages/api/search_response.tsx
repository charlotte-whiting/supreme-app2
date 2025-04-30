import type { NextApiRequest } from "next";
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: NextApiRequest, res) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Return a list of movies, shows, and novels related to the plot of ${req.body}. Must have books in response. Please include at least 4 entries for each.`;

  const response = await ai.models.generateContent({
    // model: "gemini-2.5-flash-preview-04-17",
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          movies: {
            type: Type.ARRAY,
            description: "List of movies",
            nullable: false,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  nullable: false,
                },
              },
            },
          },
          shows: {
            type: Type.ARRAY,
            description: "List of shows",
            nullable: false,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  nullable: false,
                },
              },
            },
          },
          books: {
            type: Type.ARRAY,
            description: "List of books",
            nullable: false,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  nullable: false,
                },
              },
            },
          },
        },
      },
    },
  });

  res.status(200).json({ message: response.text });
}
