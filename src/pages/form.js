import { useEffect, useState } from "react";
import Form from "next/form";

export default function FormPg() {
  const [essayPrompt, setEssayPrompt] = useState("");

  useEffect(() => {
    const result = async () => {
      try {
        const res = await fetch("/api/ai-response");
        // console.log(res);
        const json = await res.json();
        setEssayPrompt(JSON.stringify(json.message));
      } catch (error) {
        console.error(error.message);
      }
    };
    result();
  }, []);

  console.log(essayPrompt);

  return (
    <div>
      give us some information about you
      <br />
      <Form>
        {/* name */}
        <label htmlFor="name">Name please</label>
        <input type="text" id="name" />
        <br />
        {/* fingers? */}
        <label htmlFor="finger">Approximate number of fingers</label>
        <input type="number" id="finger" />
        <br />
        {/* how many hours of sleep */}
        <label htmlFor="sleep">
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
        <label htmlFor="animals">Pick animals that you resonate with:</label>
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
        <label htmlFor="prompt">
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
