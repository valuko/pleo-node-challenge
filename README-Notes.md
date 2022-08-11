# Pleo Node Challenge

## User API Docs

### GET /user/v1/get-all-users
This endpoint returns paginated results of all the users in the database
#### QueryParams:
* sort_by (optional) - The field to use for sorting the users data. Defaults to id
* sort_order (optional) - The sort order of the provided sort field. Possible values are ASC and DESC. Defaults to ASC 
* limit (optional) - The maximum number of records to return in each request. When -1 is specified, it returns all the provided records. Defaults to 100
* offset (optional) - The offset number of records to skip before retrieving the next batch of data

This endpoint will return the following response on success:
```
    {
        "meta": {
            "total": 250,
            "count": 0,
            "offset": 0,
            "limit": 100
        }
        "users": [
          {
            "id": "da140a29-ae80-4f0e-a62d-6c2d2bc8a474",
            "first_name":"jeppe",
            "last_name":"rindom",
            "company_name":"pleo",
          }
        ]
    }
```

### GET /expense/v1/get-all-expenses
This endpoint returns all the expenses available in the DB. It also supports searching and sorting the results
#### QueryParams:
* user_id (optional) - Specifying this will only fetch expenses for the user with the provided ID
* status (optional) - Only fetches expenses that have the provided status
* merchant_name (optional) - Fetches all expenses which have a merchant with a name starting with the provided value
* currency (optional) - Fetches expenses with which have the provided currency value
* min_amount (optional) - The minimum amount in cents to limit the results to
* max_amount (optional) - The maximum amount in cents to limit the results to
* start_date (optional) - The minimum value of the date_created column to consider
* end_date (optional) - The maximum value of the date_created to consider
* sort_by (optional) - The field to use for sorting the expenses data. Defaults to date_created
* sort_order (optional) - The sort order of the provided sort field. Possible values are ASC and DESC. Defaults to DESC
* limit (optional) - The maximum number of records to return in each request. When -1 is specified, it returns all the provided records. Defaults to 100
* offset (optional) - The offset number of records to skip before retrieving the next batch of data

This endpoint will return the following response on success:
```
    {
        "meta": {
            "count": 6,
            "total": 6,
            "limit": 100,
            "offset": 0
        }
        expenses: [
          {
            "id": "285a5b8e-fb44-4763-9c71-9bd445b2783a",
            "merchant_name": "BRUS",
            "amount_in_cents": -5000,
            "user_id": "3d16547a-79f6-4f62-9034-d3bfb31fb37c",
            "currency": "DKK",
            "date_created": "2021-09-19T01:57:40.021Z",
            "status": "processed"
          }
        ]
    }
```

### GET /expense/v1/get-expense-details
This endpoint returns the details of the expense matching the provided `expense_id`
#### QueryParams:
* expense_id (required) - The ID of the expense to fetch its full details
```
{
    "id": "f20866f9-7d46-45f2-822c-4b568e216a13",
    "merchant_name": "Donkey Republic",
    "amount_in_cents": 6000,
    "amount": 60,
    "user_id": "da140a29-ae80-4f0e-a62d-6c2d2bc8a474",
    "currency": "DKK",
    "date_created": "2021-09-20T01:57:40.021Z",
    "status": "processed"
}
```


### Implementation Notes

1. Since the endpoints are mostly meant for retrieving data, the endpoints were implemented as GET endpoints with the params sent as query strings.
The endpoints do not require any complicated parameter which would require POST request method in this implementation
2. I felt implementing all fields as sortable gives the API client the flexibility to control the sort order
3. I implemented all search params as possible because I felt it is important to support searching the data
especially the date_created and the amount_in_cents which support range filtering
4. I set the default maximum results from the search APIs to 100 to prevent dumping all the data at once
The APIs also allow the clients to use -1 to indicate all results whould be returned at once without the need for pagination
5. I should have implemented the rest of the CRUD endpoints (Create, Update and Delete) for expenses. 
However, I felt I have spent too much time on the task and didnt want to drag it longer.
For production ready scenario, I would have ensured these accompanying endpoints are implemented

### Future improvements

1. Complete unit and acceptance tests. I felt I had taken too much time on the task, hence why I did not complete the unit and acceptance tests
2. Implement the rest of the CRUD endpoints; Create, Update and Delete Expense
3. Add authentication to prevent unauthorized access
4. Since I support searching via multiple fields, I will need to add DB indexes to the date_created, merchant_name, status and currency columns
Doing this will greatly optimize the queries to fetch the data
5. Improve error handling to safely catch errors and send safe error messages and codes to the client
6. Implement authentication make sure requests are authenticated before they can be passed
7. Improved logging and debug/info messages to help with debugging
8. Endpoints should follow the RESTful convention for naming
