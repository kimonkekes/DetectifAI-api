const express = require('express')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt')

const { handleRegister } = require('./controllers/register') 
const { handleSignIn } = require('./controllers/signIn')
const { handleProfile } = require('./controllers/profile')
const { handleImage, handleApiCall } = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'pass',
      database : 'DetectifAI-db'
    }
  });

const app = express()

app.use(express.json())
app.use(cors())

const saltRounds = 10;


app.get('/', (req, res)=> {res.send(db.users)})
app.post('/signin', handleSignIn(db, bcrypt))
app.post('/register', handleRegister(db, bcrypt, saltRounds))
app.get('/profile/:id', handleProfile(db))
app.put('/image', handleImage(db))
app.post('/imageurl', handleApiCall)

app.listen(3000, ()=> {
    console.log('App is running on port 3000')
})