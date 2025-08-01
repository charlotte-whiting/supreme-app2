import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

// checkbox is to explore, heart is interest - to db

function SearchResults({ results }) {
  const [checkedMap, setCheckedMap] = useState({});
  const [displayDesc, setDisplayDesc] = useState(false);
  const categories = Object.keys(results);
  categories.forEach((category) => {
    checkedMap[category] = [];
  });
  const handleCheck = (category: string, name: string) => () => {
    const shouldBeChecked = !checkedMap[category]?.name;
    setCheckedMap({
      ...checkedMap,
      [category]: {
        ...checkedMap[category],
        [name]: shouldBeChecked,
      },
    });
  };
  return (
    <Stack>
      <Stack direction="row">
        <Typography>
          Here are the search results - select what interest you!
        </Typography>
        <Button
          variant={displayDesc ? "contained" : "outlined"}
          onClick={() => {
            setDisplayDesc(!displayDesc);
          }}
        >
          Display Descriptions
        </Button>
      </Stack>
      <Stack direction="row">
        {categories.map((category) => {
          console.log(results[category]);
          return (
            <FormControl key={category}>
              <FormLabel>{category}</FormLabel>
              <FormGroup>
                {results[category].map((item, i) => {
                  console.log(checkedMap[category][item.name]);
                  return (
                    <Stack key={i}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedMap[category][item.name]}
                            onChange={handleCheck(category, item.name)}
                            name={item.name}
                          />
                        }
                        label={item.name}
                      />
                      {displayDesc ? (
                        <Typography>{item.description}</Typography>
                      ) : null}
                    </Stack>
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

function SearchProgress({ progress }) {
  console.log(progress[0]);
  let searchList = "";
  for (let i = 0; i < progress.length; i++) {
    const next = i == progress.length - 1 ? "" : " > ";
    searchList = searchList + progress[i] + next;
  }
  return (
    <Stack>
      <Typography>Current Search History:</Typography>
      <Typography sx={{ pl: 2 }}>{searchList}</Typography>
    </Stack>
  );
}

export default function ExtendedInfo() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchProgress, setSearchProgress] = useState([]);

  const onSubmit = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
    setSearchProgress([...searchProgress, searchText]);
    setSearchText("");
  };
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
      {searchProgress ? <SearchProgress progress={searchProgress} /> : null}
      {isLoading ? <CircularProgress /> : null}
      {results ? <SearchResults results={results} /> : null}
    </Stack>
  );
}
