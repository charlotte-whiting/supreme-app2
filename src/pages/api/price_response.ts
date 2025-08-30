import type { NextApiRequest } from "next";
import { GoogleGenAI } from "@google/genai";
import pkg from "pg";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export default async function handler(req: NextApiRequest, res) {
  const allComics = [];

  await Promise.all(
    req.body.map(async (comicNameAndIssue) => {
      const prompt = `Please tell me only the estimated value for an ungraded ${comicNameAndIssue} in very fine condition in the following format: *Title* *Issue Number* *Price Range*`;
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      const comic = response.text;
      const splitResponse = comic.split("*");
      const { Pool } = pkg;
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      // 1/3/5 bc of split
      allComics.push([splitResponse[1], splitResponse[3], splitResponse[5]]);
      const query = {
        text: "INSERT INTO first_attempt.comics(name, issue_number, price) VALUES($1, $2, $3)",
        values: [splitResponse[1], splitResponse[3], splitResponse[5]],
      };

      pool.query(query);
    })
  );
  res.status(200).json({ message: allComics });
}
