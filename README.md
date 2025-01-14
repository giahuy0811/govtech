# Govtech App

A Node.js application built with [Express](https://expressjs.com/), [TypeORM](https://typeorm.io/), and [MySQL](https://www.mysql.com/).

## Prerequisites

Before running the app, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/)

### Installation

Follow these steps to install and run the app:

1. Clone the repository:
   git clone https://github.com/giahuy0811/govtech.git

cd govtech

2. Install dependencies:

npm install

3. Create the .env file with following environment variables

   EXPRESS_PORT=5000
   JWT_SECRET=
   JWT_REFRESH_SECRET=
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=
   DB_PASS=
   DB_NAME=
   MYSQL_ROOT_PASS=
   JWT_ACCESS_TOKEN_EXPIRE=
   JWT_REFRESH_TOKEN_EXPIRE=

### Docker

1. Run docker mysql docker container

docker compose up -d

### Run the app

1. In case you want to start

npm run build

npm start

1. In case you want to develop

npm run dev

### Seed data

Send following request to create data

POST /api/seed

### Testing

npm test

### Running ESLint

1. You can run ESLint to check for issues in your code by running the following command:

npm run lint

2. Fixing Issues Automatically (ESLint can automatically fix some issues by running:)

npm run lint:fix
