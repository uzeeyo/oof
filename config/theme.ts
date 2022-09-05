
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
          main: "#4de072"
        },
        secondary: {
            main: "#f570b9"
        }
    },
  });

  declare module '@mui/material/styles' {
    interface Theme {
        palette: {
            primary: {
              main: string;
            },
            secondary: {
                main: string;
            },
        };
    }
  }