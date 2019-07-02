import axios from 'axios';
import moment, { Moment } from 'moment';

export class Timesheet {
  constructor(
    public projectCode: string,
    public date: Moment,
    public hours: number,
  ) {}
}

interface ApiTimesheet {
  projectCode: string;
  date: string;
  hours: number;
}

function jsonToTimesheet(json: ApiTimesheet): Timesheet {
  return {
    ...json,
    date: moment(json.date),
  }
}

const cache = {};

/**
 * Fetch all timesheets for a given duration
 * 
 * @param from the first moment to be fetched
 * @param to (optional) the last moment to be fetched
 */
export default async function getTimesheets(from: Moment, to?: Moment): Promise<Array<Timesheet>> {
  const res = await axios.get('/timesheets', {
    params: {
      fromDate: from.format('YYYY-MM-DD'),
      toDate: to ? to.format('YYYY-MM-DD') : undefined,
    }
  });
  console.debug('received response from api');
  console.debug(`${res.data ? (res.data.projects ? res.data.projects.length : 0) : 0} projects returned`);
  return res.data ? (res.data["projects"] ? res.data.projects.map(jsonToTimesheet) : []) : [];
}

export async function getProjectsForWeek(week: Moment): Promise<Array<string>> {
  const ts = await getTimesheets(week.clone().startOf('isoWeek'), week.clone().endOf('isoWeek'));
  return [...new Set(ts.map(t => t.projectCode))].sort();
}

export function daysOfWeek(week: Moment): Array<Moment> {
  const monday = week.clone().startOf('isoWeek');
  return [
    monday,
    monday.clone().add(1, 'd'),
    monday.clone().add(2, 'd'),
    monday.clone().add(3, 'd'),
    monday.clone().add(4, 'd'),
    monday.clone().add(5, 'd'),
    monday.clone().add(6, 'd'),
  ];
}

function findDateAndProject(ts: Timesheet[], day: Moment, project: string): (Timesheet | null) {
  const filtered = ts.filter(t => t.date.isSame(day, 'day') && t.projectCode === project);
  if (filtered.length > 1) {
    throw new Error(`Multiple entries found for project code ${project} on ${day}`);
  }
  return filtered.length ? filtered[0] : null;
}

export async function getTimesheetForWeek(week: Moment): Promise<Map<string, Map<Moment, number>>> {
  const ts = await getTimesheets(week.clone().startOf('isoWeek'), week.clone().endOf('isoWeek'));
  return new Map<string, Map<Moment, number>>((await getProjectsForWeek(week)).map(
    p => [p, new Map(daysOfWeek(week).map(
      d => {
        const t = findDateAndProject(ts, d, p);
        return [d, t ? t.hours : 0];
      }
    ))]
  ));
}