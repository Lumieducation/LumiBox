import * as React from "react";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";

import { IState } from "../state";

interface IStateProps {
  classes: any;
}

interface IDispatchProps {
  dispatch: (action: any) => any;
}
interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class Tools extends React.Component<IProps, IComponentState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  public componentWillMount() {}

  public render() {
    const { classes } = this.props;
    return (
      <div id="tools">
        <div className={classes.content}>
          <Paper>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="Wekan" src="/assets/wekan.svg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Wekan"
                  secondary={<a href="#">http://wekan.on.Lumi.education</a>}
                />
                <ListItemSecondaryAction>
                  <Switch checked={true} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="Etherpad" src="/assets/etherpad.svg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Etherpad"
                  secondary="starting on http://etherpad.on.Lumi.education"
                />
                <ListItemSecondaryAction>
                  <Switch
                    classes={{
                      switchBase: classes.colorSwitchBase,
                      checked: classes.colorChecked,
                      bar: classes.colorBar
                    }}
                    checked={true}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <LinearProgress />
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="Wikipedia" src="/assets/wikipedia.png" />
                </ListItemAvatar>
                <ListItemText primary="Wikipedia" />
                <ListItemSecondaryAction>
                  <Switch checked={false} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="EtherCalc" src="/assets/ethercalc.png" />
                </ListItemAvatar>
                <ListItemText primary="EtherCalc" />
                <ListItemSecondaryAction>
                  <Switch checked={false} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="Moodle" src="/assets/moodle.png" />
                </ListItemAvatar>
                <ListItemText primary="Moodle" />
                <ListItemSecondaryAction>
                  <Switch checked={false} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="WordPress" src="/assets/wordpress.png" />
                </ListItemAvatar>
                <ListItemText primary="WordPress" />
                <ListItemSecondaryAction>
                  <Switch checked={false} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="HackMD" src="/assets/hackmd.png" />
                </ListItemAvatar>
                <ListItemText primary="HackMD" />
                <ListItemSecondaryAction>
                  <Switch checked={false} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="Rocket.Chat" src="/assets/rocketchat.svg" />
                </ListItemAvatar>
                <ListItemText primary="Rocket.chat" />
                <ListItemSecondaryAction>
                  <Switch checked={false} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt="NextCloud" src="/assets/nextcloud.png" />
                </ListItemAvatar>
                <ListItemText primary="NextCloud" />
                <ListItemSecondaryAction>
                  <Switch checked={false} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            className={classes.button}
          >
            Install Tool
          </Button>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  button: {
    marginTop: "10px"
  },
  colorSwitchBase: {
    color: "#FFC107",
    "&$colorChecked": {
      color: "#FFC107",
      "& + $colorBar": {
        backgroundColor: "#FFC107"
      }
    }
  },
  colorBar: {},
  colorChecked: {}
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

export default withStyles(styles)(
  connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
  )(Tools)
);
