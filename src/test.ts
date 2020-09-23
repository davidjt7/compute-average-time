import { analyzeTasks } from '.';
import { SortKey } from './types';

const result: string = analyzeTasks(`6
1 IN
2 US
3 BZ
4 US
5 US
6 JP
8
1 1 10
2 1 5
3 2 10
4 1 23
5 2 9
6 3 12
7 4 10
8 4 11`, SortKey.AverageTime, SortKey.CountryCode);

console.log(result);