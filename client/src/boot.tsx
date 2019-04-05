import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { history, default as store } from "./store";
import { ConnectedRouter } from "connected-react-router";
import { hot } from 'react-hot-loader/root';

// themes
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

// pages root
import Root from "./pages/root";

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <Switch>
          <Route path="/" component={hot(Root)} />
        </Switch>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("lumi")
);
