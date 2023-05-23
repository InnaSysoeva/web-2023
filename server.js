const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
//var jsonParser = bodyParser.json();

const app = express()

const db = new sqlite3.Database('./clinic.db');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/images'));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// app.get('/account', (req, res) => {
//   res.sendFile(__dirname + '/public/account.html')
// })

app.post('/appointment', (req, res) => {
  let name = req.body.name;
  let number = req.body.number;
  let brief = req.body.brief;
  if(name === '' || number === '') {
    res.send('not okey')
  }
  else {
    db.run('INSERT INTO appointments (name, number, brief, state) VALUES ( ?, ?, ?, ?)', [name, number, brief, 'false']);
    res.sendFile(__dirname + "/public/approve.html")
  } 
  db.close()
})

app.post('/account', (req, res) => {
  const email  = req.body.email;
  let password = req.body.password;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (!row) {
          res.send('Користувача не знайдено');
      } 
      else if (row.password != password)
      {
        res.send('Не правильно введено пароль')
      }
      else if (row.state === 'user') {
        res.sendFile(__dirname + "/public/user_account.html")
      }
      else {
        res.sendFile(__dirname + "/public/admin_account.html")
      }
  });
  db.close()
});

app.post('/registration', (req, res) => {
  const useremail  = req.body.email;
  let password = req.body.password;
  db.get('SELECT * FROM users WHERE email = ?', [useremail], (err, row) => {
      if (!row) {
        db.run('INSERT INTO users (email, password, state) VALUES (?, ?, ?)', [useremail, password, 'user']);
        res.send('Акаунт користувача')
      } 
      else if (row.email === useremail)
      {
        res.send('Користувач з такою електронною поштою вже існує')
      }
  });
  db.close()
});

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})
