import logo from './logo.svg';
import './App.css';
import SearchAppBar from './components/SearchAppBar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

import * as React from 'react';

export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function App() {
  const [mode, setMode] = React.useState('light');
  const [apiData, setApiData] = React.useState({});

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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <SearchAppBar />
        <div>
          <Typography variant='body1'>
            {JSON.stringify(apiData)}
          </Typography>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
