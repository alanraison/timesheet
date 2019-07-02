import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import ListTimesheets from './ListTimesheets';
import HuiTheme from './HuiTheme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <MuiThemeProvider theme={HuiTheme}>
          <CssBaseline/>
          <AppBar position="absolute">
            <Toolbar>
              <Typography component="h1" variant="h6" color="inherit" noWrap>
                Timesheets
              </Typography>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
            <div className={classes.appBarSpacer}/>
            <ListTimesheets/>
          </main>
        </MuiThemeProvider>
      </div>
    </Router>
  );
}

export default App;
