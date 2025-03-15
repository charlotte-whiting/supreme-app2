import { useEffect, useState } from "react";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function FormPg() {
  const [essayPrompt, setEssayPrompt] = useState("");
  const [animal, setAnimal] = useState([]);

  useEffect(() => {
    const result = async () => {
      try {
        const res = await fetch("/api/ai-response");
        const json = await res.json();
        setEssayPrompt(JSON.stringify(json.message));
      } catch (error) {
        console.error(error.message);
      }
    };
    result();
  }, []);

  const onSelectChange = (event) => {
    const value = event.target.value;
    setAnimal(typeof value === "string" ? value.split(",") : value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/submit", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: event.target[0].value,
        fingers: event.target[2].value,
        animals: animal,
        prompt: event.target[6].value,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <Stack container direction="column" sx={{ maxWidth: 1 / 2 }} spacing={2}>
      <form onSubmit={onSubmit}>
        {/* name */}
        <TextField label="name" variant="outlined" />
        {/* fingers? */}
        <InputLabel>Approximate number of fingers</InputLabel>
        <TextField label="" variant="outlined" />
        {/* how many hours of sleep */}
        {/* select all animals */}
        <InputLabel>Pick animals that you resonate with:</InputLabel>
        <Select
          value={animal}
          name="resonators"
          labelId="animals"
          multiple={true}
          onChange={onSelectChange}
        >
          <MenuItem value="capybara">capybara</MenuItem>
          <MenuItem value="skink">skink</MenuItem>
          <MenuItem value="skunk">skunk</MenuItem>
          <MenuItem value="cuttlefish">cuttlefish</MenuItem>
          <MenuItem value="armadillo">armadillo</MenuItem>
          <MenuItem value="zebra">zebra</MenuItem>
          <MenuItem value="quokka">quokka</MenuItem>
          <MenuItem value="blobfish">blobfish</MenuItem>
          <MenuItem value="prarie dog">prarie dog</MenuItem>
          <MenuItem value="scottish cow">scottish cow</MenuItem>
          <MenuItem value="barracuda">barracuda</MenuItem>
        </Select>
        {/* chatgpt prompt */}
        <Typography>
          Please answer this definitely not AI generated prompt:{" "}
          {essayPrompt
            ? essayPrompt
            : "Oops no api key :/ ... just write something fun"}
        </Typography>
        <TextField name="prompt" label="" rows="50" cols="50" />
        <br />
        <Button variant="outlined" type="submit">
          Submit Answers
        </Button>
      </form>
    </Stack>
  );
}
