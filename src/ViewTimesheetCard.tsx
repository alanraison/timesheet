import React, { useState } from 'react';
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
import { Timesheet } from './api';

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
  timesheets,
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  function handleOpenClick() {
    setOpen(!open);
  }

  const start = moment(week).startOf('isoWeek');
  const allProjects = [...new Set(timesheets.map(t => t.projectCode))].sort();
  const monday = start;
  const tuesday = start.clone().add(1, 'd');
  const wednesday = start.clone().add(2, 'd');
  const thursday = start.clone().add(3, 'd');
  const friday = start.clone().add(4, 'd');
  const saturday = start.clone().add(5, 'd');
  const sunday = start.clone().add(6, 'd');
  const allDays = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];

  const allTime = new Map<string, Map<Moment, number>>(allProjects.map(p => [p, new Map([[monday, 1]])
  ]))

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
              <TableCell>Project</TableCell>
              <TableCell>{monday.format(DAY_FORMAT)}</TableCell>
              <TableCell>{tuesday.format(DAY_FORMAT)}</TableCell>
              <TableCell>{wednesday.format(DAY_FORMAT)}</TableCell>
              <TableCell>{thursday.format(DAY_FORMAT)}</TableCell>
              <TableCell>{friday.format(DAY_FORMAT)}</TableCell>
              <TableCell>{saturday.format(DAY_FORMAT)}</TableCell>
              <TableCell>{sunday.format(DAY_FORMAT)}</TableCell>
            </TableHead>
            <TableBody>
              {
                allProjects.map(p => {
                  const ts = timesheets.filter((t) => t.projectCode === p);
                  return (
                    <TableRow>
                      <TableCell>{p}</TableCell>
                      <TableCell>
                        
                      </TableCell>
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