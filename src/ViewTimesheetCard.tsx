import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles'; 
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import moment, { Moment } from 'moment';
import { getTimesheetForWeek, daysOfWeek, Timesheet } from './api';

const DAY_FORMAT = 'dd Do MMM';
const WEEK_FORMAT = 'Do MMM';

const useStyles = makeStyles((theme: Theme) => {

});

function getForProjectCodeAndDay(projectCode: string, day: Moment, timesheets: Timesheet[]) {
  const ts = timesheets.filter(t => t.projectCode === projectCode && t.date.isSame(day, 'day'))
  if (ts.length > 1) {
    throw new Error(`Multiple entries found for project code ${projectCode} on ${day}`);
  }
  return ts.length ? ts[0].hours : 0;
}

const ViewTimesheetCard: React.FC<{week: string, timesheets: Timesheet[]}> = ({
  week,
}) => {
  const [open, setOpen] = useState(false);
  const [weeklyTimesheet, setTimesheet] = useState<Map<string, Map<Moment, number>>>(new Map()); 
  const classes = useStyles();
  useEffect(() => {
    getTimesheetForWeek(moment(week)).then(setTimesheet);
  }, [week]);

  function handleOpenClick() {
    setOpen(!open);
  }

  const start = moment(week).startOf('isoWeek');
  const allDays = daysOfWeek(moment(week));

  return (
    <Card>
      <CardActionArea onClick={handleOpenClick}>
        <CardHeader
          title={`${
              start.format(WEEK_FORMAT)
            } - ${
              start.clone().endOf('isoWeek').format(WEEK_FORMAT)
            }`
          }
          action={
            <IconButton
              onClick={handleOpenClick}
              aria-label="view timesheet"
              aria-expanded={open}
            >
              {open ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </IconButton>
          }
        />
      </CardActionArea>
      <Collapse in={open} unmountOnExit>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                {
                  allDays.map(d => <TableCell key={d.format(DAY_FORMAT)}>{d.format(DAY_FORMAT)}</TableCell>)
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                [...weeklyTimesheet.entries()].map(([p, ts]) => {
                  return (
                    <TableRow key={p}>
                      <TableCell>{p}</TableCell>
                      {
                        [...ts.values()].map(hours => (
                          <TableCell>
                            {hours}
                          </TableCell>
                        ))
                      } 
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </CardContent>
        <CardActions>
          Edit
        </CardActions>

      </Collapse>
      
    </Card>
  )
}

export default ViewTimesheetCard;