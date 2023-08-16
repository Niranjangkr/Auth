require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 4000;
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let tokens = [];

app.post('/login', (req, res) => {
    // user authentication done

    const username = req.body.username;
    const user = { username: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    tokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken});
});


app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) res.sendStatus(401);
    if(!tokens.includes(refreshToken)) res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403);
            console.log(user.username);
            const accessToken = generateAccessToken({username: user.username });
            return res.json({accessToken: accessToken});
    });
});

app.delete('/logout', (req, res) => {
    tokens = tokens.filter(token => token != req.body.token);
    res.sendStatus(204);
});

function generateAccessToken(user) {
    console.log(user)
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15s"});
}

app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
})