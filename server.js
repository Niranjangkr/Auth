require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const post = [
    {
        name: "Niranjan",
        title: "post 1"
    },
    {
        name: "Harsh",
        title: "post 2"
    },
    {
        name: "Leban",
        title: "post 3"
    }
]

app.get('/post', authenticateToken, (req, res) => {

    return res.json(post.filter(ele => ele.name === req.user?.username));
});

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    // Bearer TOKEN
    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){
            console.log("expired");
            return res.sendStatus(403);  
        } 
        req.user = user;
        next();
    });

    
    next();
}

app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
})