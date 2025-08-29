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
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type SearchText = {
  clickedText: string[];
  typedText: string;
};

// checkbox is to explore, heart is interest - to db
type AppContextType = {
  searchText: SearchText;
  setSearchText: Dispatch<SetStateAction<SearchText>>;

  // typedSearchText: string;
  // setTypedSearchText: Dispatch<SetStateAction<string>>;
  // clickedSearchText: Array<string>;
  // setClickedSearchText: Dispatch<SetStateAction<Array<string>>>;
};

const AppContext = createContext<AppContextType>({
  searchText: {
    clickedText: [],
    typedText: "",
  },
  setSearchText: null,
  // typedSearchText: "",
  // setTypedSearchText: null,
  // clickedSearchText: [],
  // setClickedSearchText: null,
});

function SearchResults({ results }) {
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
      searchTextState.setSearchText((currentState) => ({
        clickedText: [...currentState.clickedText, name],
        typedText: [...currentState.clickedText, name].join(","),
      }));
    } else {
      const newClickedSearchText =
        searchTextState.searchText.clickedText.filter((item) => item != name);
      searchTextState.setSearchText((currentState) => ({
        clickedText: newClickedSearchText,
        typedText: newClickedSearchText.join(","),
      }));
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
  return (
    <Stack direction="row">
      <Typography>{typedSearchText}</Typography>
    </Stack>
  );
}

export default function ExtendedInfo() {
  // const [typedSearchText, setTypedSearchText] = useState("");
  // const [clickedSearchText, setClickedSearchText] = useState([]);
  const defaultSearchTextValue = {
    clickedText: [],
    typedText: "",
  };
  const [searchText, setSearchText] = useState(defaultSearchTextValue);
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
      body: JSON.stringify(searchText.typedText),
    });
    const aiResults = await response.json();
    setResults(JSON.parse(aiResults.message));
    setIsLoading(false);
    setSearchProgress([...searchProgress, searchText.typedText]);
    setSearchText(defaultSearchTextValue);
  };
  return (
    <AppContext.Provider
      value={{
        searchText,
        setSearchText,
      }}
    >
      <Stack>
        <TextField
          label="Search"
          onChange={(event) => {
            setSearchText({
              typedText: event.target.value,
              clickedText: event.target.value.split(","),
            });
          }}
          value={searchText.typedText}
        />
        <SearchDisplay
          typedSearchText={searchText.typedText}
          clickedSearchText={searchText.clickedText}
        />
        <Button onClick={onSubmit}>Submit</Button>
        {searchProgress ? <SearchProgress progress={searchProgress} /> : null}
        {isLoading ? <CircularProgress /> : null}
        {results ? <SearchResults results={results} /> : null}
      </Stack>
    </AppContext.Provider>
  );
}
