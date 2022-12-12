import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from '@mui/material/';
import "./App.css";

import { theme } from './components/theme/theme.js';
import { EthProvider } from "./contexts/EthContext";
import VotingProvider from "./contexts/VotingContext/VotingProvider";
import VotingApp from "./components/VotingApp";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <EthProvider>
        <VotingProvider>
          <VotingApp/>
        </VotingProvider>
      </EthProvider>
    </ThemeProvider>
  );
}

export default App;
