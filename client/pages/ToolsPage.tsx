import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import { IState } from '../state';

import * as Tools from 'lib/tools';

interface IStateProps {
    classes: any;

    tools: Tools.types.ITool[];
}

interface IDispatchProps {
    dispatch: (action: any) => any;
}
interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class ToolsPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Tools.actions.get_tools());
    }

    public render() {
        const { classes, tools } = this.props;
        return (
            <div id="tools">
                <div className={classes.content}>
                    <Paper>
                        <List>
                            {tools.map(tool => (
                                <div key={tool._id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={tool.name}
                                                src={tool.logo_url}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={tool.name}
                                            secondary={
                                                tool.status === 'running' ? (
                                                    <a href="#">
                                                        http://{tool.name}
                                                        .on.Lumi.education
                                                    </a>
                                                ) : null
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                onClick={() =>
                                                    tool.status === 'running'
                                                        ? this.props.dispatch(
                                                              Tools.actions.stop_tool(
                                                                  tool._id
                                                              )
                                                          )
                                                        : this.props.dispatch(
                                                              Tools.actions.start_tool(
                                                                  tool._id
                                                              )
                                                          )
                                                }
                                                checked={
                                                    tool.status === 'running'
                                                }
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {tool.status === 'pending' ? (
                                        <LinearProgress />
                                    ) : null}
                                    <Divider />
                                </div>
                            ))}
                            {tools.length === 0 ? (
                                <div>
                                    loading
                                    <LinearProgress />
                                </div>
                            ) : null}
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
        marginTop: '10px'
    },
    colorSwitchBase: {
        color: '#FFC107',
        '&$colorChecked': {
            color: '#FFC107',
            '& + $colorBar': {
                backgroundColor: '#FFC107'
            }
        }
    },
    colorBar: {},
    colorChecked: {}
});

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        tools: Tools.selectors.tools(state)
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
    )(ToolsPage)
);
