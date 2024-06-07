const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const mongoString = process.env.DB_MONGO;
const app = express();
app.use(cors());
app.use(express.json());

// Connetti a MongoDB
mongoose.connect(mongoString)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));;

// Rotte e modello
const Beach = require('./models/beach');
const beachesRouter = require('./routes/beaches')(Beach); // Passa il modello Beach alle rotte delle spiagge

app.use('/', beachesRouter);

// Avvia il server
const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
