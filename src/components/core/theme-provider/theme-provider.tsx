import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as CssVarsProvider } from '@mui/material/styles';


import EmotionCache from './emotion-cache';
import { createTheme } from '../../../styles/theme/create-theme';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const theme = createTheme();

  return (
    <EmotionCache options={{ key: 'mui' }}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </EmotionCache>
  );
}
