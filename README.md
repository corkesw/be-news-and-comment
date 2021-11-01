# News and Comment Server

[Link to demo version](https://backend-pro-news.herokuapp.com/api)

Welcome to the News and Comment Server! This application was created as part of my bootcamp experience at [northcoders](https://northcoders.com) as one of a number of projects completed on the course. The purpose of creating the app was to consolidate everything that I had learned about backend development.

In simple terms, the app is a backend server which hosts user created articles. The api which serves up the articles allows for sorting and pagination of the data. Additionally, it allows users to leave comments and vote on articles.

The data is held on an SQL database and the app utilises node-postgres to access and update data.

The app was developed using node.js v16.8.0 and postgres (PostgreSQL) v13.3

-----------------------------------------------------------

## Installing

First clone project and install dependencies

`$ git clone https://github.com/corkesw/be-nc-news.git`

`$ cd be-nc-news`

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

You will need to create two .env files for your project: .env.test and .env.development. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment. The default names are nc_news_test and nc_news for the test and dev environments respectively. These can be changed in `./db/setup.sql` if required.

You should run the script `npm setup-dbs` to create the databases. To seed the database in the current ENV, run `npm run seed`. This will clear all data and reset the tables with the original data. This is provided in the `db` folder in both dev and test environments.

----------------------------------------------------------
## Testing 

Several test suites are provided in the `__tests__` folder;

|  file | script  | useage  |
|---|---|---|
|  app.test.js |  npm t app |  tests server endpoints |
|   dbquery.tests.js| npm t db  |  tests util functions that intreact with db |
|  utils.test.js |  npm t utils |  tests standard util functions |

You should avoid running all 3 suites at the same time (ie `npm t`) as this is likely to cause errors.

----------------------------------------------------------

## Hosted site

You can see the endpoints on the hosted site here:

[News and Comment Server](https://backend-pro-news.herokuapp.com/api)

## License

[MIT](https://choosealicense.com/licenses/mit/)


