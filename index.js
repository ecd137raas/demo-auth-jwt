const express = require('express');
const bodyparse = require('body-parser');
const jwt = require('jwt-simple');
const users = require('./users');
const cfg = require('./config');

const auth = require('./auth')();
const app = express();

app.use(bodyparse.json());
app.use(auth.initialize());

app.get("/", function(req,res) {
    res.json({status: "API OK!"});
});

app.get("/user", auth.authenticate(), function(req, res) {
    res.json(users[req.user.id]);
    });

app.post("/token", function(req, res){
    if (req.body.email && req.body.password){
        var email = req.body.email;
        var password = req.body.password;
        var user = users.find(function(u){
            return u.email === email && u.password === password;
        });
    }
        if (user){
            const payload = {id: user.id};
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({token: token});
        } else {
            res.sendStatus(401);
        } 
});

app.listen(3000, function() {
    console.log("My API is running...");
    });

module.exports = app;