import { useEffect, useState } from "react";
import Form from "next/form";

// questions:
// next Form vs form
// dependencies q below
// storing data - prob falls under Form v form?
// why warning for 'for' when mdn says its ok

// async function FetchAiResult() {
//   try {
//     // ai code: i think the current problem is that useEffect rerenders everytime bc the prompt keeps changing?
//     // no idea how to get around this...
//     const { GoogleGenerativeAI } = require("@google/generative-ai");
//     const genAI = new GoogleGenerativeAI(
//       "uhhh put the api key in"
//     );
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt =
//       "Give me a short paragraph prompt that would be given in a college history course";

//     const res = await model.generateContent(prompt);
//     // console.log(res.response.text());
//     return res.response.text();
//   } catch (error) {
//     console.log("you messed up again", error.message);
//   }
// }

export default function FormPg() {
  // name - string
  // height - number
  // how many hours of sleep did you get - range picker
  // all animals that you feel like apply to you - checkbox
  // answer this essay question from google ai

  const [essayPrompt, setEssayPrompt] = useState("");
  // useEffect(() => {
  //   const result = async () => {
  //     try {
  //       const res = await FetchAiResult();
  //       setEssayPrompt(res);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   result();
  // }, []);
  // // ^ why does adding 'no dependencies' work?

  // console.log(essayPrompt);

  return (
    <div>
      give us some information about you
      <br />
      <Form>
        {/* name */}
        <label for="name">Name please</label>
        <input type="text" id="name" />
        <br />
        {/* fingers? */}
        <label for="finger">Approximate number of fingers</label>
        <input type="number" id="finger" />
        <br />
        {/* how many hours of sleep */}
        <label for="sleep">
          How many hours did you sleep last night? {"("}round up{")"}
        </label>
        <select name="sleephours" id="sleep">
          <option value="">
            Pick one! {"("}not this one{")"}
          </option>
          <option value="0-3">0 - 3</option>
          <option value="4-7">4 - 7</option>
          <option value="8-11">8 - 11</option>
          <option value="12+">12+</option>
        </select>
        <br />
        {/* select all animals */}
        <label for="animals">Pick animals that you resonate with:</label>
        <select name="resonators" id="animals" multiple={true}>
          <option value="capybara">capybara</option>
          <option value="skink">skink</option>
          <option value="skunk">skunk</option>
          <option value="cuttlefish">cuttlefish</option>
          <option value="armadillo">armadillo</option>
          <option value="zebra">zebra</option>
          <option value="quokka">quokka</option>
          <option value="blobfish">blobfish</option>
          <option value="prarie dog">prarie dog</option>
          <option value="scottish cow">scottish cow</option>
          <option value="barracuda">barracuda</option>
        </select>
        <br />
        {/* chatgpt prompt */}
        <label for="prompt">
          Please answer this definitely not AI generated prompt:{" "}
          {essayPrompt
            ? essayPrompt
            : "Oops no api key :/ ... just write something fun"}
        </label>
        <br />
        <textarea id="prompt" name="prompt" rows="4" cols="50" />
      </Form>
    </div>
  );
}
