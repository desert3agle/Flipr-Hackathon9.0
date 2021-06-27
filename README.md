# Flipr-Hackathon9.0 / Mailing Service

A Web-app to schedule and send Recurring, Weekly, Monthly, Yearly mails. 

Live Deployed [here](https://floating-sea-65611.herokuapp.com/user/login).


## Built With
* [NodeJS](https://nodejs.org/en/docs/) -  evented I/O for the backend
* [Express](https://expressjs.com/) - framework for backend
* [Mongoose](https://mongoosejs.com/) - ODM
* [MongoDB](https://www.mongodb.com/) - Database
* [Express Handlebars](https://www.npmjs.com/package/express-handlebars) - Html templating
* [Node Cron](https://www.npmjs.com/package/node-cron) - Job scheduler

## Getting Started
These instructions will get your copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
you need to have NodeJs/npm installed on your machine
### Installation


Install dependencies 
```sh
$ npm install
```

Set up environment variables 

```sh
    cd config
    cp config.env.template config.env
```
fill the values for env variables

### Local Run
After setting up environment proceed with local run 
```sh
$ npm start
```

## File System
```sh
.
├── config 
│             ├── auth.js
│             ├── config.env
│             ├── db.js
│             └── passport.js
├── controllers  
│             └── notifier.js
├── helpers
│             └── hbs.js
├── index.js
├── models                        
│             ├── gUser.js
│             ├── MailDB.js
│             └── User.js
├── package.json
├── package-lock.json
├── public
│             └── css
│                 ├── main.css
│                 └── style.css
├── README.md
├── routes                        
│             ├── auth.js
│             ├── history.js
│             ├── index.js
│             ├── notify.js
│             └── users.js
└── views                         
    ├── create.hbs
    ├── dashboard.hbs
    ├── edit.hbs
    ├── error
    │             ├── 400.hbs
    │             ├── 404.hbs
    │             └── 500.hbs
    ├── history.hbs
    ├── layouts
    │             ├── login.hbs
    │             └── main.hbs
    ├── login.hbs
    ├── partials
    │             ├── _add_btn.hbs
    │             ├── _flash.hbs
    │             └── _header.hbs
    ├── register.hbs
    └── show.hbs

```
## Screen Shots

## Deployment


### Heroku Deployment
```sh
$ heroku login -i
$ heroku git:remote -a <your-app-name>
$ git push heroku master
```
Set up environment variables 
```sh
$ heroku config:set ENV_VAR=<value>
```

## Authors
* **Mohit Jaiswal** - *Initial work* - [kelvin0179](https://github.com/kelvin0179)
* **Harsh Vardhan** - *Initial work* - [desert3agle](https://github.com/desert3agle)
