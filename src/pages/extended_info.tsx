import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

function SearchResults({ results }) {
  const keys = Object.keys(results);
  return (
    <Stack>
      <Typography>
        Here are the search results - select what interest you!
      </Typography>
      <Stack direction="row">
        {keys.map((key) => {
          console.log(results[key]);
          return (
            <FormControl key={key}>
              <FormLabel>{key}</FormLabel>
              <FormGroup>
                {results[key].map((item, i) => {
                  return (
                    <FormControlLabel
                      key={i}
                      control={<Checkbox checked={true} name={item.name} />}
                      label={item.name}
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default function ExtendedInfo() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState();

  const onSubmit = async () => {
    const response = await fetch("/api/search_response", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(searchText),
    });
    const aiResults = await response.json();
    setResults(JSON.parse(aiResults.message));
  };
  console.log(results);
  return (
    <Stack>
      <TextField
        label="Search"
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
      />
      <Typography>{searchText}</Typography>
      <Button type="submit" onClick={onSubmit}>
        Submit
      </Button>
      {results ? <SearchResults results={results} /> : null}
    </Stack>
  );
}
