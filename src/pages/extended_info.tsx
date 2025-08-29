import { Favorite, FavoriteBorder } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  CssBaseline,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

type SearchText = {
  clickedText: string[];
  typedText: string;
};

type AppContextType = {
  searchText: SearchText;
  setSearchText: Dispatch<SetStateAction<SearchText>>;
  favoriteList: Array<string>;
  setFavoriteList: Dispatch<SetStateAction<Array<string>>>;
};

const AppContext = createContext<AppContextType>({
  searchText: {
    clickedText: [],
    typedText: "",
  },
  setSearchText: null,
  favoriteList: [],
  setFavoriteList: null,
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

  // TODO: cleanup
  const handleFavorite = (name) => (event) => {
    event.preventDefault();

    const newFavoriteList = searchTextState.favoriteList.includes(name)
      ? searchTextState.favoriteList.filter((item) => item != name)
      : [...searchTextState.favoriteList, name];

    searchTextState.setFavoriteList(newFavoriteList);
    localStorage.setItem("favoriteList", JSON.stringify(newFavoriteList));
  };

  return (
    <Stack>
      <Stack direction="row" sx={{ mt: 5 }}>
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
                        label={
                          <>
                            {
                              <Checkbox
                                icon={
                                  // TODO: clean logic up
                                  !searchTextState.favoriteList.includes(
                                    item.name
                                  ) ? (
                                    <FavoriteBorder />
                                  ) : (
                                    <Favorite />
                                  )
                                }
                                onChange={handleFavorite(item.name)}
                              />
                            }
                            {item.name}
                          </>
                        }
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
  // let searchList = "";
  // for (let i = 0; i < progress.length; i++) {
  //   const next = i == progress.length - 1 ? "" : " > ";
  //   searchList = searchList + progress[i] + next;
  // }
  return (
    <Stack>
      <Typography>Current Search History:</Typography>
      <Typography sx={{ pl: 2 }}>
        {/* {searchList} */}
        {progress.map((item, i) => (
          <Chip label={item} key={i}/>
        ))}
      </Typography>
    </Stack>
  );
}

function SearchDisplay({ typedSearchText }) {
  return (
    <Stack direction="row">
      <Typography>{typedSearchText}</Typography>
    </Stack>
  );
}

function Favorites() {
  const searchContext = useContext(AppContext);
  return (
    <Stack>
      <Typography variant="h5">Favorites</Typography>
      <List dense disablePadding>
      {searchContext.favoriteList.map((item, i) => {
        return (
            <ListItem dense key={i}>
              &bull;&nbsp;<Typography variant="body2">{item}</Typography>
            </ListItem>
        );
      })}
      </List>
    </Stack>
  );
}

const drawerWidth = 240;

export default function ExtendedInfo() {
  const defaultSearchTextValue = {
    clickedText: [],
    typedText: "",
  };
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [searchText, setSearchText] = useState(defaultSearchTextValue);
  const [favoriteList, setFavoriteList] = useState([]);
  // TODO: cleanup workaround for nextjs
  useEffect(() => {
    const fl = localStorage.getItem("favoriteList")
      ? JSON.parse(localStorage.getItem("favoriteList"))
      : [];
    setFavoriteList(fl);
  }, []);
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

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <AppContext.Provider
      value={{
        searchText,
        setSearchText,
        favoriteList,
        setFavoriteList,
      }}
    >
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1}}>
        <Toolbar>
                    <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={[
              {
                mr: 2,
              }
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
      <Stack direction={"row"}>
        <Stack sx={{ flexGrow: "1" }}>
          <TextField
            label="Search"
            onKeyUp={(event) => {
              if (event.key == "Enter") {
                onSubmit();
              }
            }}
            onChange={(event) => {
              setSearchText({
                typedText: event.target.value,
                clickedText: event.target.value.split(","),
              });
            }}
            value={searchText.typedText}
          />
          <SearchDisplay typedSearchText={searchText.typedText} />
          <Button onClick={onSubmit}>Submit</Button>
          <Stack>
            {searchProgress ? (
              <SearchProgress progress={searchProgress} />
            ) : null}
            {isLoading ? <CircularProgress /> : null}
            {results ? <SearchResults results={results} /> : null}
          </Stack>
        </Stack>
      </Stack>
      </Box>
      <Drawer
        variant="persistent"
        open={drawerOpen}
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
        >
                  <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Favorites />
          </Box>
        </Drawer>
      </Box>
    </AppContext.Provider>
  );
}
