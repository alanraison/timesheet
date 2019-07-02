import React, { useEffect, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import moment, { Moment } from 'moment';
import getTimesheets, { Timesheet } from './api';
import ViewTimesheetCard from './ViewTimesheetCard';

const useStyles = makeStyles((theme: Theme) => ({
  weekTile: {
    display: 'block',
    listStyleType: 'none',
    backgroundColor: theme.palette.background.default,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export function partitionIntoWeeks(timesheets: Timesheet[]) {
  const weekMap = new Map<string, Timesheet[]>();
  timesheets.forEach(t => {
    const key = t.date.format('GGGG[W]WW');
    const existing = weekMap.get(key) || [];
    existing.push(t)
    existing.sort((l, r) =>
      moment.duration(l.date.diff(r.date)).asMilliseconds()
    );
    weekMap.set(key, existing);
  });
  return weekMap;
}

const ListTimesheets: React.FC<{month?: Moment}> = ({
  month,
}) => {
  const classes = useStyles();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  useEffect(() => {
    try {
      getTimesheets((month || moment()).startOf('month')).then(setTimesheets);
    } catch (e) {
      console.error('could not fetch timesheets', e);
    }
  }, [month]);
  
  const weeks = partitionIntoWeeks(timesheets);
  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar color="secondary">
          <Typography variant="subtitle1" color="inherit" align="center" noWrap>
            {(month || moment()).format("MMMM YYYY")}
          </Typography>
        </Toolbar>
      </AppBar>
      <ul>
        {
          new Array(...weeks.entries()).map(([week, ts]) => {
            return <ViewTimesheetCard key={week} week={week} timesheets={ts}/>
            /*
            <li key={week} className={classes.weekTile}>
              {moment(week).startOf('week').format('Do MMM YYYY')}
            </li>
            */
          }
          )
        }
      </ul>
      <Fab color="primary" className={classes.fab} aria-label="Add Timesheet">
        <AddIcon />
      </Fab>
    </>
  );
}

export default ListTimesheets;