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
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

// checkbox is to explore, heart is interest - to db
type AppContextType = {
  typedSearchText: string,
  setTypedSearchText: Dispatch<SetStateAction<string>>,
  clickedSearchText: Array<string>,
  setClickedSearchText: Dispatch<SetStateAction<Array<string>>>,
}

const AppContext = createContext<AppContextType>({
  typedSearchText: '',
  setTypedSearchText: null,
  clickedSearchText: [],
  setClickedSearchText: null
});

function SearchResults({ results, setClickedSearchText, clickedSearchText }) {
  const [checkedMap, setCheckedMap] = useState(new Map());
  const [displayDesc, setDisplayDesc] = useState(false);
  const categories = Object.keys(results);
  const searchTextState = useContext(AppContext);
  const handleCheck = (category: string, name: string) => () => {
    const isChecked = checkedMap.get(category + " " + name) || false;
    const newCheckedMap = new Map(checkedMap);
    newCheckedMap.set(category + " " + name, !isChecked);
    setCheckedMap(newCheckedMap);
    if (!isChecked) {
      setClickedSearchText([...clickedSearchText, name]);
      searchTextState.setTypedSearchText('unchecked');
    } else {
      const newClickedSearchText = clickedSearchText.filter(
        (item) => item != name
      );
      setClickedSearchText(newClickedSearchText);
      searchTextState.setTypedSearchText('checked');

    }
  };
  return (
    <Stack>
      <Stack direction="row" gap={5} sx={{ mt: 5 }}>
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
          return (
            <FormControl key={category}>
              <FormLabel>{category}</FormLabel>
              <FormGroup>
                {results[category].map((item, i) => {
                  return (
                    <Stack key={i}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              checkedMap.get(category + " " + item.name) ||
                              false
                            }
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

function SearchDisplay({ typedSearchText, clickedSearchText }) {
  let clickedList = "";
  for (let i = 0; i < clickedSearchText.length; i++) {
    const next = i == clickedSearchText.length - 1 ? "" : ", ";
    clickedList = clickedList + clickedSearchText[i] + next;
  }
  return (
    <Stack direction="row">
      <Typography>
        {typedSearchText}, {clickedList}
      </Typography>
    </Stack>
  );
}

export default function ExtendedInfo() {
  const [typedSearchText, setTypedSearchText] = useState("");
  // const [searchText, setSearchText] = useState("");
  const [clickedSearchText, setClickedSearchText] = useState([]);
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
      body: JSON.stringify(typedSearchText),
    });
    const aiResults = await response.json();
    setResults(JSON.parse(aiResults.message));
    setIsLoading(false);
    setSearchProgress([...searchProgress, typedSearchText]);
    setTypedSearchText("");
  };
  return (
    <AppContext.Provider value={{
      typedSearchText: typedSearchText, 
      setTypedSearchText: setTypedSearchText,
      clickedSearchText: clickedSearchText,
      setClickedSearchText: setClickedSearchText
    }
    }>
      <Stack>
        <TextField
          label="Search"
          onChange={(event) => {
            setTypedSearchText(event.target.value);
          }}
          value={typedSearchText}
        />
        <SearchDisplay
          typedSearchText={typedSearchText}
          clickedSearchText={clickedSearchText}
        />
        <Button onClick={onSubmit}>Submit</Button>
        {searchProgress ? <SearchProgress progress={searchProgress} /> : null}
        {isLoading ? <CircularProgress /> : null}
        {results ? (
          <SearchResults
            results={results}
            setClickedSearchText={setClickedSearchText}
            clickedSearchText={clickedSearchText}
          />
        ) : null}
      </Stack>
    </AppContext.Provider>
    );
}
