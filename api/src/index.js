const express = require('express');
const path = require("path");
const session = require("express-session");
const store = new session.MemoryStore();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(session({
    name: "cookieMonster",
    secret: "my secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: false,
        maxAge: 3600000,
        secure: false,               //for development use, for production, set to true
    },
    store: store,
}))

app.use(express.json());
app.use((req, res, next) => {
    //https://traveltour-frontend.onrender.com
    res.header("Access-Control-Allow-Origin", PORT === 3001 ? "http://localhost:3000" : "https://ashy-stone-0eb98320f.3.azurestaticapps.net/");
    res.header("Access-Control-Allow-Headers", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.listen(PORT, () => {console.log("Listening on port " + PORT)});
app.use(express.static(path.join(__dirname, "..", "..", "front-end", "build")));

postDataBase = {};
users = {
    "user": "123",
};

function sendBack(req, res, next) {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "front-end", "build", "index.html"));
};

app.get("/", sendBack);
app.get("/login", sendBack);
app.get("/about", sendBack);
app.get("/place/:key", sendBack);
app.get("/myPosts", sendBack);
app.get("/register", sendBack);


app.get("/api/getList", (req, res, next) => {
    console.log("perfomed get");
    res.send(postDataBase);
});


app.post("/api/add", (req, res, next) => {
    console.log("performed post");
    const newItem = req.body;
    console.log(newItem);
    const name = newItem.key;
    if (postDataBase[name] !== undefined) {
        postDataBase[name].unshift(newItem.list);
    }
    else {
        postDataBase[name] = [];
        postDataBase[name].unshift(newItem.list);
    }
    console.log(postDataBase);
    res.send(postDataBase);
});

app.delete("/api/delete", (req, res, next) => {
    console.log("performed delete");
    console.log(req.body);
    const itemKey = req.body.key;
    const location = req.body.location;
    postDataBase[location].splice(itemKey, 1);
    console.log(postDataBase);
    res.send(postDataBase);
})

app.put("/api/edit", (req, res, next) => {
    console.log("started edit");
    console.log(req.body);
    const result = req.body;
    const place = result.place;
    const index = result.index;
    postDataBase[place][index].editing = true;
    console.log(postDataBase[place]);
    res.send(postDataBase);
});

app.post("/api/finishEdit", (req, res, next) => {
    console.log("finished edit");
    const result = req.body;
    const index = result.index;
    const place = result.place;
    console.log(postDataBase[place]);
    const post = postDataBase[place][index];
    post.content = result.content;
    post.rating = result.rating;
    post.name = result.name;
    post.date = result.date;
    post.editing = false;
    res.send(postDataBase);
});

app.post("/api/register", (req, res, next) => {
    console.log(req.body);
    const user = req.body.value;
    const pass = req.body.pass;
    if (!(user in users)) {
        users[user] = pass;
        res.send({status: "success"});
    }
    else {
        res.send({status: "failed"});
    }
});

app.post("/api/login", (req, res, next) => {
    console.log(users);
    const username = req.body.value;
    const password = req.body.pass;
    if (req.session.authenticated) {
        req.session.user = username;
        res.send({status: "logged in", data: req.sessionID});
    }
    else {
        //use some sort of hashing tool for production
        if (users[username] === password) {
            req.session.authenticated = true;
            req.session.user = username;
            res.cookie("name", username, {
                maxAge: 3600000,
                httpOnly: false,
            });
            res.send({status: "logged in", data: req.sessionID});
        }
        else {
            res.send({status: "authentication error"});
        }
    }
});

app.get("/api/isloggedIn", (req, res, next) => {
    if (req.session.authenticated) {
        res.send({user: req.session.user, status: "authenticated", store: store});
    }
    else {
        res.send({status: "not authenticated"});
    }
})

module.exports = app;

