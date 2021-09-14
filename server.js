/* Idea of API Design
/ --> res = working
/signin --> POST = success/fail
/signup --> POST = user
/profile/:userId --> GET = user
/image --> PUT    update rank 
*/

// If you are using Express 4.16+ you don't have to import body-parser anymore. You can do it just like this:

// app.use(express.urlencoded({extended: true}));
// app.use(express.json()) // To parse the incoming requests with JSON payloads

const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const app = express();

const { handleSignUp } = require('./controllers/signup');
const { handleProfile } = require('./controllers/profile');
const { handleSignIn } = require('./controllers/signin');
const { handleImage, handleApiCall } = require('./controllers/images');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: '123',
    database: 'facerecognitiondb'
  }
});

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => handleSignIn(req, res, db, bcrypt));

app.post('/signup', (req, res) => handleSignUp(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => handleProfile(req, res, db));

app.put('/image', (req, res) => handleImage(req, res, db));

app.post('/imageurl', (req, res) => handleApiCall(req, res));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

console.log();
