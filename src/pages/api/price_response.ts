import type { NextApiRequest } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pkg from "pg";

export default async function handler(req: NextApiRequest, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const allComics = [];

  await Promise.all(
    req.body.map(async (comicNameAndIssue) => {
      const prompt = `Please tell me only the estimated value for an ungraded ${comicNameAndIssue} in very fine condition in the following format: *Title* *Issue Number* *Price Range*`;
      const result = await model.generateContent(prompt);
      const comic = result.response.text();
      const splitResponse = comic.split("*");
      const { Pool } = pkg;
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      // 1/3/5 bc of split
      allComics.push([splitResponse[1], splitResponse[3], splitResponse[5]]);
      const query = {
        text: "INSERT INTO first_attempt.comics(name, issue_number, price) VALUES($1, $2, $3)",
        values: [splitResponse[1], splitResponse[3], splitResponse[5]],
      };

      const res = await pool.query(query);
      console.log(res.rows[0]);
      console.log(allComics);
    })
  );
  res.status(200).json({ message: allComics });
}
