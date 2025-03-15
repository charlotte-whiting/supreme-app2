import type { NextApiRequest } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const toReturn = [];

  //   since it's async it does it out of order and doesnt return anything
  // also out of order so can't even guess

  await Promise.all(
    req.body.map(async (x) => {
      const prompt =
        // `Please tell me only the estimated value for an ungraded ${x} in very fine condition`;
        `Please tell me only the estimated value for an ungraded ${x} in very fine condition in the following format: *Title* *Issue Number* *Price Range*`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      // used to have it be csv but that quickly didn't work
      const splitResponse = response.split("*");
      const concat = [splitResponse[1], splitResponse[3], splitResponse[5]];
      toReturn.push(concat);
    })
  );

  // console.log(result.response.text());
  res.status(200).json({ message: toReturn });
}
