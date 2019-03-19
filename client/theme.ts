import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: { main: "#3F51B5" },
    secondary: { main: "#009688" }
  }
});

export default theme;
