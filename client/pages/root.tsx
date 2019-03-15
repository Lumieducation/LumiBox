import * as React from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { IState } from "../state";

import ToolsPage from "./tools";

interface IStateProps {
  classes: any;
}

interface IDispatchProps {
  dispatch: (action: any) => any;
}
interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class Root extends React.Component<IProps, IComponentState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  public componentWillMount() {}

  public render() {
    const { classes } = this.props;
    return (
      <div id="root">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Lumi
            </Typography>
          </Toolbar>
        </AppBar>
        <AppBar position="static">
          <Tabs value={0} variant="fullWidth">
            <Tab label="Tools" />
            <Tab label="Resources" />
            <Tab label="WiFi" />
            <Tab label="System" />
          </Tabs>
        </AppBar>
        <div className={classes.content}>
          <Switch>
            <Route exact={true} path="/" component={ToolsPage} />
            <Route exact={true} path="/tools" component={ToolsPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  content: {
    maxWidth: "680px",
    margin: "auto"
  }
});

function mapStateToProps(state: IState, ownProps): IStateProps {
  return {
    classes: ownProps.classes
  };
}

function mapDispatchToProps(dispatch): IDispatchProps {
  return {
    dispatch: (action: any) => dispatch(action)
  };
}

export default withRouter(
  withStyles(styles)(
    connect<{}, {}, {}>(
      mapStateToProps,
      mapDispatchToProps
    )(Root)
  )
);
