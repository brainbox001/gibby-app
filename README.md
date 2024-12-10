# gibby-app
A stock market/fixed deposit app
# Demo-credit
Respository for a demo wallet application.
### URL
  + App's url - [https://marcus-daniel-lendsqr-be-test.onrender.com](https://gibby-app.onrender.com/) .
  + App's review - https://docs.google.com/document/d/19dCTSMWMoc4D90tWG068EAZV8EjU-rG9_arfJK-KF7k/edit?usp=sharing .
### Note :
+ If trying to access the app and it delays to load, that's because the cloud service has spin down the app due to inactivity, you just have to wait for about 2 minutes or less.

### Tech stacks:
+ Node.js(express).
+ Typescript.
+ Mysql(knex js ORM).

### Features
  + A basic authentication system that authenticate users with their email and password.
  + Registered users are able to fund their wallet.
  + Feature that allows users to withdraw from their wallet.
  + Allows users to transfer funds from their wallet to another user's wallet.
  + App handles authorization too, that means it ensures a user can't try to transfer funds from another user's wallet.
  + Users can only transfer or withfraw amounts that are less than their current balance.
  + Users can log back into their account in case they were logged out.
  + Rejects signup request from users found in the adjutor's karma blacklist.
  + Unauthenticated users can't perform :-
    - withdraw.
    - fund account.
    - transfer funds.
### Database schema
  + The database schema e-r diagram link is pasted below:
  + [db e-r diagram](https://dbdesigner.page.link/PU2n88tgMTGbR7jh7)

### Setup
  + git clone https://github.com/brainbox001/demo-credit .
  + Install node js.
  + open you bash shell, or command line tool, navigate to the root of the app's directory and run :
    - npm install.
    - npx tsc.
    - npm run migrate
    - npm run dev (for development environment) || npm start (for production environment).
### Endpoints
+ **GET / :**
  - returns a welcome message for unauthenticated users and user's details for authenticated users.
+ **POST /register :**
    - Registers a new user.
    - **params :**
        - name : string *required.
        - email : string *required.
        - password : string *required.
        - phoneNumber *10 digits : number *required.
+ **POST /login :**
    - Logs in a user. 
    - **params :**
        - email : string *required.
        - password : string *required.
+ **POST /logout :**
    - Logs out a user.
      
+ **POST /fund :**
    - Handles request to fund user's wallet.
    - Assumes a third party function or service had handled communications with the user's bank and returned an approved status.
    -  **params :**
        - status **"approved"**: string *required.
        - accountNo : number *required.
        - amount : number *required.
+ **POST /transfer :**
    - Handles transfer of funds from a user wallet to another.
    -  **note :** You can't transfer funds from another user's account, except you have access to that user's account.
    -  **params :**
        - sender *you : number *required.
        - receiver : number *required.
        - amount : number *required.
+ **POST /withdraw :**
    - Handles withdrawl of funds from a user's wallet.
    - **note :** You can't withdraw funds from another user's account, except you have access to that user's account.
    - **params :**
        - userAcc *yours : number *required.
        - amount : number *required.
  
+ The request would accept strings for phoneNumber, accountNo, sender, receiver, amount, userACC and numbers for password, a parser function will parse them before forwarding to the controller, but for consisteency, use the right parameters.
## Test
  + App is fully tested with unit testing, integration testing and testing with a client side(postman).

For more info about the app, contact me - +2348168958556 on whatsapp || momsdboy@gmail.com - email.

**Still in development, open for contributions.**
