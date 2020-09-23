## API Link
**POST** https://cat-serve.davidjt7.vercel.app/analyze/tasks

### Sample Request
req.body
```
{
    "input": "6\n1 IN\n2 US\n3 BZ\n4 US\n5 US\n6 JP\n6\n1 1 10\n2 1 5\n3 2 10\n4 1 23\n5 2 9\n6 3 12",
    "userSort": "averageTime",
    "countrySort": "averageTime"
}
```

#### userSort
Sort by userId or averageTime

#### countrySort
Sort by countryCode or averageTime