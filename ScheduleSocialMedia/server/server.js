const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbconfig = require('./config/dbConfig');

const port = process.env.PORT_NUMBER || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


