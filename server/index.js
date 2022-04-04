const express = require('express')
const cors = require('cors')
require('dotenv').config();
const connectToMongo = require('./db')

const app = express();

connectToMongo();

app.use(cors());

app.get('/', () => {
    console.log("hi");
})

app.use('/api/auth', require('./routers/userAuth'));
app.use('/api/selling', require('./routers/selling'));

const port = 5000;

app.listen(port, () => {
    console.log(`Server running at port: http://loacalhost:${port}`);
})