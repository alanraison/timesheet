import getTimesheets, * as api from './api';
import moment from 'moment';
import axios from 'axios';

jest.mock('axios');

describe('Timesheet api', () => {
  describe('#getTimesheets', () => {
    it('should get timesheets from the specified date onwards', async () => {
      const now = moment();
      (axios.get as jest.Mock).mockResolvedValue({data: {
        projects: []
      }});
      await getTimesheets(now);
      expect(axios.get).toHaveBeenCalledWith('/timesheets', {
        params: {
          fromDate: now.format('YYYY-MM-DD'),
          toDate: undefined,
        },
      });
    })
  });
  describe('#getDaysOfWeek', () => {
    it('should start the week on Monday', () => {
      const day = moment('2019-07-04');
      expect(api.daysOfWeek(day)[0].isSame(moment('2019-07-01'), 'days')).toBeTruthy();
    });
    it('should contain 7 days', () => {
      expect(api.daysOfWeek(moment()).length).toBe(7);
    })
  });
  describe('#getProjectsForWeek', () => {
    it('should get timesheet projects sorted alphabetically with no duplicated', async () => {
      const timesheets = {
        projects: [
          jsonTimesheet('xyz', '2019-07-01', 6),
          jsonTimesheet('def', '2019-07-02', 3),
          jsonTimesheet('fgh', '2019-07-02', 4.5),
          jsonTimesheet('def', '2019-07-05', 3),
        ]
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: timesheets });
      expect(api.getProjectsForWeek(moment('2019-07-05'))).resolves.toEqual(['def', 'fgh', 'xyz']);
    })
  })
});

function jsonTimesheet(projectCode: string, date: string, hours: number) {
  return {
    projectCode,
    date,
    hours,
  }
}