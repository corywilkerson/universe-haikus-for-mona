const express = require('express');
const app = express();
const address = process.env.ADDRESS || 'localhost'
const port = process.env.PORT || 3000
const { Pool } = require('pg')
app.locals.octicons = require("@primer/octicons");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  pool.query('SELECT * FROM haikus ORDER BY id', (err, haikus) => {
    res.render('index', {haikus: haikus.rows});
  });
});

app.post('/heart', (req, res) => {
  pool.query('UPDATE haikus SET hearts = hearts + 1 WHERE id = $1', [req.body.id], () => {
    res.send('Success');
  });
});

app.listen(port, address);
console.log(`Server running on ${address}:${port}`)