import {
  User,
  Task,
  CountryTotalAndFrequency,
  UserTotalAndFrequency,
  UserAverage,
  CountryAverage,
  Sortable,
  SortKey,
  Separator,
  UserSortKey,
  CountrySortKey
} from './types';
import { EOL } from 'os';

export const analyzeTasks = (input: string, userSortKey?: UserSortKey, countrySortKey?: CountrySortKey) => {
  const inputString = inputStringToTuple(input);
  const inputJSON = formatInput(inputString);
  const { users, tasks } = inputJSON;

  const userAverages = initUserAverages(users);
  computeUserAverages(userAverages, users, tasks, userSortKey || SortKey.AverageTime);

  const countryAverages = initCountryAverages(users);
  computeCountryAverages(countryAverages, users, tasks, countrySortKey || SortKey.AverageTime);

  let outputString = '';
  for (const userAverage of userAverages) {
    outputString += `${userAverage.userId} ${userAverage.averageTime}${EOL}`;
  }
  for (const countryAverage of countryAverages) {
    outputString += `${countryAverage.countryCode} ${countryAverage.averageTime}${EOL}`;
  }
  return outputString.slice(0, -1);
};

const inputStringToTuple = (input: string) => input.split(/\r?\n/);

const formatInput = (input: string[]) => {
  const userCount = +input[0];
  const taskCount = +input[userCount + 1];
  const users = input.slice(1, userCount + 1);
  const tasks = taskCount ? input.slice(userCount + 2, taskCount + userCount + 2) : input.slice(userCount + 2);

  const userJSONArray: User[] = [];
  for (const user of users) {
    userJSONArray.push({
      userId: +user.split(Separator.ColumnSeparator)[0],
      countryCode: user.split(Separator.ColumnSeparator)[1],
    });
  }

  const taskJSONArray: Task[] = [];
  for (const task of tasks) {
    taskJSONArray.push({
      taskId: +task.split(Separator.ColumnSeparator)[0],
      userId: +task.split(Separator.ColumnSeparator)[1],
      timeSpent: +task.split(Separator.ColumnSeparator)[2],
    });
  }
  return { users: userJSONArray, tasks: taskJSONArray };
};

const initUserAverages = (users: User[]) => {
  const userAverages: UserAverage[] = [];
  for (const user of users) {
    userAverages.push({
      userId: user.userId,
      averageTime: 0,
    });
  }
  return userAverages;
};

const initCountryAverages = (users: User[]) => {
  const countryAverages: CountryAverage[] = [];
  const distinctCountryCodes = getCountryCodes(users);

  for (const countryCode of distinctCountryCodes) {
    countryAverages.push({
      countryCode,
      averageTime: 0,
    });
  }
  return countryAverages;
};

const computeUserAverages = (userAverages: UserAverage[], users: User[], tasks: Task[], sortKey: SortKey.User | SortKey.AverageTime) => {
  const userTaskSumsAndCounts: UserTotalAndFrequency[] = [];
  for (const user of users) {
    userTaskSumsAndCounts.push({
      userId: user.userId,
      totalTimeSpent: 0,
      taskCount: 0,
    });
  }

  for (const userTimeSpentAndCount of userTaskSumsAndCounts) {
    for (const task of tasks) {
      if (task.userId === userTimeSpentAndCount.userId) {
        userTimeSpentAndCount.totalTimeSpent += task.timeSpent;
        userTimeSpentAndCount.taskCount += 1;
      }
    }
  }

  for (let i = 0; i < userTaskSumsAndCounts.length; i++) {
    userAverages[i].averageTime = +(userTaskSumsAndCounts[i].totalTimeSpent / userTaskSumsAndCounts[i].taskCount).toFixed(2) || 0;
  }
  sortByKey(userAverages, sortKey);
};

const computeCountryAverages = (countryAverages: CountryAverage[], users: User[], tasks: Task[], sortKey: SortKey.CountryCode | SortKey.AverageTime) => {
  const countryTaskSumsAndCounts: CountryTotalAndFrequency[] = [];
  const countryCodes = getCountryCodes(users);
  for (const countryCode of countryCodes) {
    countryTaskSumsAndCounts.push({
      countryCode,
      users: [],
      totalTimeSpent: 0,
      taskCount: 0,
    });
  }

  for (const timeSpentAndTaskCountPerCountry of countryTaskSumsAndCounts) {
    for (const user of users) {
      if (user.countryCode === timeSpentAndTaskCountPerCountry.countryCode) {
        timeSpentAndTaskCountPerCountry.users.push(user.userId);
      }
    }
  }

  for (const timeSpentAndTaskCountPerCountry of countryTaskSumsAndCounts) {
    for (const task of tasks) {
      if (timeSpentAndTaskCountPerCountry.users.includes(task.userId)) {
        timeSpentAndTaskCountPerCountry.totalTimeSpent += task.timeSpent;
        timeSpentAndTaskCountPerCountry.taskCount += 1;
      }
    }
  }

  for (let i = 0; i < countryTaskSumsAndCounts.length; i++) {
    countryAverages[i].averageTime = +(countryTaskSumsAndCounts[i].totalTimeSpent / countryTaskSumsAndCounts[i].taskCount).toFixed(2) || 0;
  }
  sortByKey(countryAverages, sortKey);
};

const getCountryCodes = (users: User[]) => {
  const countryCodes: string[] = [];
  for (const user of users) {
    countryCodes.push(user.countryCode);
  }
  const distinctCountryCodes = [...new Set(countryCodes)];
  return distinctCountryCodes;
};

const sortByKey = (array: Sortable[], key: string) => array.sort((a: Sortable, b: Sortable) => {
  const x = a[key]; const y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
});
