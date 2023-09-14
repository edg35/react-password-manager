require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mysql = require('mysql');
const cors = require('cors');
const { encrypt, decrypt } = require('./ecryptionhandler');

//Enable client and server to communicate
app.use(cors());

//Enable server to accept json reqs
app.use(express.json());

//Connect to local sql instance
const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
 
app.get('/api/users/getpasswords', (req, res) => {
    db.query("SELECT * FROM passwords", (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });

});

app.post('/api/users/decrypt', (req, res) => {
    res.send(decrypt(req.body));
})

//Add password to database
app.post('/api/users/addpassword', function (req, res) {
    //Get password and service from client and get the date it was created
    const {password, service} = req.body;
    const datelastupdated= new Date().toISOString().slice(0, 10);
    const encryptedPassword= encrypt(password);

    //Add values to database
    db.query("INSERT INTO passwords (passwords,service,iv,datelastupdated) VALUES (?,?,?,?)",
    [encryptedPassword.password, service, encryptedPassword.iv,datelastupdated],
    (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});