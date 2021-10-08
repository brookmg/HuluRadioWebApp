import * as React from 'react';
import './App.css';
import SearchAppBar from './components/SearchAppBar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';


export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function App() {
  const [mode, setMode] = React.useState('dark');
  const [searchString, setSearchString] = React.useState("");
  const [apiData, setApiData] = React.useState([]);

  React.useEffect(() => {
    fetch('http://huluradio.herokuapp.com/radio')
      .then(res => res.json()).then(setApiData)

  }, [])
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const handleSearchTextChange = (ev) => setSearchString(ev.target.value)

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Paper style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          overflowY: 'scroll'
        }}>
          <SearchAppBar onSearchTextChange={handleSearchTextChange} />
          <div>

            <Box m={2} sx={{ overflowY: 'auto' }}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {apiData.filter((e) => {
                  const r = new RegExp(searchString, "i");
                  return r.test(e.stationName) || r.test(e.stationDescription)
                }
                ).map((e, i) => (
                  <Grid item xs={2} sm={4} md={4} key={i}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={e.stationIcon}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {e.stationName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {e.stationDescription}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        </Paper>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
