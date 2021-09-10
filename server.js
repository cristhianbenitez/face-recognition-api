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

const express = require('express');

const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: '123',
      name: 'Pipe',
      email: 'pipe@gmail.com',
      password: '15975369',
      entries: 0,
      joined: new Date()
    },
    {
      id: '1243',
      name: 'Cristhian',
      email: 'cristhiane@gmail.com',
      password: '15975369cristhian',
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
  res.json('signing');
});

app.post('/signup', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '1223',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      res.json(user);
    }
  });
  if (!found) {
    res.status(400).json('not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.params;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json('image not found');
  }
});

app.listen(3000, () => {
  console.log('app is running');
});
