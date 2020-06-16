const express = require('express');
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const application = express();
require('dotenv').config();

mongoose.connect(
    'mongodb+srv://tudorindan:' + process.env.DB_PASSWORD +'@movienator-cluster-3ubgk.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

application.use(express.json());
application.use('/auth', authRoute);

application.use((req, res, next) => {
    res.status(404).json({ message: 'NOT FOUND' });
})

application.use((error, req, res, next) => {
    res.status(500).json({ message: 'SOMETHING WENT WRONG' });
    console.log(error);
})

application.listen(process.env.PORT || 3000);
