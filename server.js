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

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'facerecognitiondb'
  }
});

db.select('*')
  .from('users')
  .then((data) => {
    console.log(data);
  });

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));
});

app.post('/signup', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) =>
    trx
      .insert({
        hash: hash,
        email
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback)
  ).catch((err) => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;

  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('not found');
      }
    })
    .catch((err) => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => {
      res.status(400).json('unable to get entries');
    });
});

app.listen(3000, () => {
  console.log('app is running');
});
