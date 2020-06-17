const express = require('express');
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const application = express();
const userActionsRoute = require('./routes/user-action');
const path = require('path');

require('dotenv').config();

mongoose.connect(
    'mongodb+srv://tudorindan:' + process.env.DB_PASSWORD +'@movienator-cluster-3ubgk.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

application.use(express.json());
application.use('/movie-covers', express.static(path.join(__dirname, 'movie-covers')));
application.use('/user-action', userActionsRoute);
application.use('/auth', authRoute);

application.use((req, res, next) => {
    return res.status(404).json({ message: 'NOT FOUND' });
})

application.use((error, req, res, next) => {
    console.log('A aparut o eroare.');
    return res.status(500).json({ message: 'SOMETHING WENT WRONG' });
})

application.listen(process.env.PORT || 3000);
