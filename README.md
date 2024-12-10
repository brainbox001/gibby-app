# Gibby-app
A backend rest api for a savings application.
### URL
  + App's url - [https://gibby-app.onrender.com](https://gibby-app.onrender.com/) .
### Note :
+ If trying to access the app and it delays to load, that's because the cloud service has spin down the app due to inactivity, you just have to wait for about 2 minutes or less.

### Tech stacks:
+ Node.js(express).
+ Typescript.
+ Postgresql(knex js ORM).

### Features
The main purpose of the app is to allow users specify a goal and save towards it.
  + It uses an email authentication, the app sends a verification code to newly registered user email.
  + The app uses the paystack payment system api to take payments from users.
  + Registered users can, specify the goal they want to save for, specify the duration(how long) he/she wants to keep the money, specify the amount to start with and make a deposit.
  + Top up feature to continue adding to the previous goals.
  + The user can withdraw when the lock duration is over.

### Setup
  + git clone https://github.com/brainbox001/gibby-app .
  + Install node js.
  + open you bash shell, or command line tool, navigate to the root of the app's directory and run :
    - npm install.
    - npx tsc.
    - npm run migrate
    - npm run dev (for development environment) || npm start (for production environment).
### Endpoints
+ **GET / :**
  - returns a welcome message for unauthenticated users and user's details for authenticated users.
This is a fullstack application so the app would accept request from the frontend only.
## Test
  + App is tested with unit testing and integration testing.

For more info about the app, contact me - +2348168958556 on whatsapp || momsdboy@gmail.com - email.

**Still in development, open for contributions.**
