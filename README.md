# News and Comment Server

[Link to app](https://backend-pro-news.herokuapp.com/api)

The News and Comment Server is an API which allows programmatic access of application data. The intention is to demonstrate the ability to create a real backend service.

The data is held on a PSQL database and the app utilises node-postgres to access and update data.

-----------------------------------------------------------

## Installing

First clone project and install dependencies

`$ mkdir news_server` 

`$ cd news_server`

`$ git clone https://github.com/corkesw/be-nc-news.git`

`$ npm install`

## Dependencies

### Production
[dotenv](https://www.npmjs.com/package/dotenv)

[express](https://expressjs.com/)

[pg](https://node-postgres.com/)

[pg-format](https://www.npmjs.com/package/pg-format)

### Development
[jest](https://jestjs.io/docs/getting-started)

[jest-sorted](https://www.npmjs.com/package/jest-sorted)

[supertest](https://www.npmjs.com/package/supertest)

[nodemon](https://www.npmjs.com/package/nodemon)

-----------------------------------------------------------
## Deployment

You will need to create two .env files for your project. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment. The default names are nc_news and nc_news_test for the dev and test environments respectively. These can be changed in `./db/setup.sql` if required.

You should run the script `npm setup-dbs` to create the databases. To seed the database in the current ENV, run `npm run seed`. This will clear all data and reset the tables with the original data. This is provided in the `db` folder in both dev and test environments.

----------------------------------------------------------
## Testing 

Several test suites are provided in the `__tests__` folder;

|  file | script  | useage  |
|---|---|---|
|  app.test.js |  npm t app |  tests server endpoints |
|   dbquery.tests.js| npm t db  |  tests util function that intreact with db |
|  utils.test.js |  npm t utils |  tests standard util functions |

You should avoid running all 3 suites at the same time (ie `npm t`) as this is likely to cause errors.

----------------------------------------------------------