export type User = {
    userId: number;
    countryCode: string;
};

export type Task = {
    taskId: number;
    userId: number;
    timeSpent: number;
};

export type CountryTotalAndFrequency = {
    countryCode: string;
    users: number[];
    totalTimeSpent: number;
    taskCount: number;
};

export type UserTotalAndFrequency = {
    userId: number;
    totalTimeSpent: number;
    taskCount: number;
};

export type UserAverage = {
    userId: number;
    averageTime: number;
};

export type CountryAverage = {
    countryCode: string;
    averageTime: number;
};

export type Sortable = UserAverage | CountryAverage;

export enum SortKey {
    AverageTime = 'averageTime',
    CountryCode = 'countryCode',
    User = 'userId'
};

export type UserSortKey = SortKey.AverageTime | SortKey.User;

export type CountrySortKey = SortKey.AverageTime | SortKey.CountryCode;

export enum Separator {
    ColumnSeparator = ' '
};
