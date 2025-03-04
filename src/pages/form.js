import { useEffect, useState } from "react";
// import Form from "next/form";
import { Button, InputLabel, MenuItem, Select, Stack, TextField, Container, Typography } from "@mui/material";


export default function FormPg() {
  const [essayPrompt, setEssayPrompt] = useState("");
  const [animal, setAnimal] = useState([])

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

  const onSelectChange = (event) => {
    const value = event.target.value
    setAnimal(typeof value === 'string' ? value.split(',') : value,)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    // const formData = new FormData(event.target)
    // formData.append('name', event.target[0].value)
    // formData.append('fingers', event.target[1].value)
    // formData.append('sleep', event.target[2])
    console.log(event.target[4].value)
    // formData.append('animal', event.target[3])
    // formData.append('essay', event.target[0].value)
    const response = await fetch('/api/submit', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({name: event.target[0].value, fingers: event.target[2].value, animals: animal, prompt: event.target[6].value})
    })
    const data = await response.json()
    console.log(data)
  }

  // console.log(essayPrompt);

  return (
    <Container>
      <Stack container direction="column" sx={{justifyContent: "flex-start", alignItems: "flex-start"}} spacing={2}>
        {/* why item no work */}
        {/* this isnt working and i'm tired of spending hours googling */}
        {/* <Item>give us some information about you</Item> */}
      {/* am i supposed to wrap this in <Box type=form> or somethign? */}
        <form onSubmit={onSubmit} sx={{maxWidth:1/4}}>
          {/* name */}
          {/* <label htmlFor="name">Name please</label> */}
         <TextField label="name" variant="outlined" id="name" />
         {/* fingers? */}
         <InputLabel id="finger">Approximate number of fingers</InputLabel>
         <TextField  label="" variant="outlined" id="finger" />
          {/* how many hours of sleep */}
         {/* <InputLabel id="sleep" >
           How many hours did you sleep last night? {"("}round up{")"}
         </InputLabel>
         <Select value="" name="sleephours" labelId="sleep" id="sleep_select">
           <MenuItem value="0-3">0 - 3</MenuItem>
           <MenuItem value="4-7">4 - 7</MenuItem>
           <MenuItem value="8-11">8 - 11</MenuItem>
           <MenuItem value="12+">12+</MenuItem>
         </Select> */}
        {/* select all animals */}
         <InputLabel id="animals">Pick animals that you resonate with:</InputLabel>
         <Select value={animal} name="resonators" labelId="animals" multiple={true} onChange={onSelectChange}>
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
         <Typography id="prompt" >
          Please answer this definitely not AI generated prompt:{" "}
          {essayPrompt
            ? essayPrompt
            : "Oops no api key :/ ... just write something fun"}
         </Typography>
         <TextField id="prompt" name="prompt" label="" rows="50" cols="50" />
         <br/>
         <Button variant="outlined" type="submit">Submit Answers</Button>
       </form>
       </Stack>
     </Container>
  );
}
