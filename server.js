const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true
});

const workoutSessionSchema = new mongoose.Schema({
  date: String,
  session: String,
});

// create a virtual paramter that turns the default _id field into id
workoutSessionSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

// Ensure virtual fields are serialised when we turn this into a JSON object
workoutSessionSchema.set('toJSON', {
  virtuals: true
});

// create a model for workout sessions
const Session = mongoose.model('Session', workoutSessionSchema);

app.get('/api/sessions', async (req, res) => {
  try {
    let sessions = await Session.find();
    res.send(sessions);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/sessions', async (req, res) => {
  const session = new Session({
    date: req.body.date,
    session: req.body.session
  });
  try {
    await session.save();
    res.send(session);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await Session.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(8000, () => console.log('Server listening on port 8000!'));
