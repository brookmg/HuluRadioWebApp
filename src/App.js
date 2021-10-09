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
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import HuluRadioIcon from './huluradio.png'
import ReactAudioPlayer from 'react-audio-player';

export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });


function App() {
  const [mode, setMode] = React.useState('dark');
  const [searchString, setSearchString] = React.useState("");
  const [apiData, setApiData] = React.useState([]);
  const [selectedStation, setSelectedStation] = React.useState({
    stationName: 'Pick a station',
  })
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioPlayerEl = React.useRef(null);

  React.useEffect(() => {
    fetch('http://huluradio.herokuapp.com/radio')
      .then(res => res.json()).then(setApiData);

    if (audioPlayerEl && audioPlayerEl.current) {
      const audio = audioPlayerEl.current.audioEl.current;
      audio.onplaying = () => setIsPlaying(true)
      audio.onpause = () => setIsPlaying(false)
    }

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
  const handleCardClick = (e) => setSelectedStation(e)

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Paper style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          paddingBottom: 64,
          overflowY: 'scroll'
        }}>
          <SearchAppBar onSearchTextChange={handleSearchTextChange} />
          <div>

            <Box sx={{ overflowY: 'auto', padding: 8 }}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {apiData.filter((e) => {
                  const r = new RegExp(searchString, "i");
                  return r.test(e.stationName) || r.test(e.stationDescription)
                }
                ).map((e, i) => (
                  <Grid item xs={2} sm={4} md={4} key={i}>
                    <Card onClick={() => handleCardClick(e)} sx={{ maxWidth: 345 }}>
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
        <Paper style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 64,
        }}>

          <Card sx={{ display: 'flex', alignItems: 'center' }}>

            <CardMedia
              component="img"
              style={{
                maxHeight: 32,
                objectFit: 'contain',
                width: 64
              }}
              image={selectedStation.stationIcon || HuluRadioIcon}
              alt={selectedStation.stationDescription}
            />
            <ReactAudioPlayer
              src={selectedStation.stationStreamUrl}
              ref={audioPlayerEl}
              autoPlay
            />

            <CardContent sx={{ flex: '1 0 auto', }}>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                {selectedStation.stationName}
              </Typography>
            </CardContent>

            <Box sx={{ paddingRight: 4, display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
              <IconButton aria-label="play/pause">
                {
                  isPlaying ?
                    <PauseIcon
                      onClick={() => {
                        if (audioPlayerEl && audioPlayerEl.current)
                          audioPlayerEl.current.audioEl.current.pause();
                      }}
                      sx={{ height: 38, width: 38 }} />
                    :
                    selectedStation.stationStreamUrl ?
                      <PlayArrowIcon
                        onClick={() => {
                          if (audioPlayerEl && audioPlayerEl.current)
                            audioPlayerEl.current.audioEl.current.play();
                        }}
                        sx={{ height: 38, width: 38 }} />
                      :
                      null
                }
              </IconButton>
            </Box>
          </Card>

        </Paper>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
