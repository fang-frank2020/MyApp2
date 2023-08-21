const express = require('express');
const path = require("path");
const session = require("express-session");
require('dotenv').config();
const mysql = require('mysql2');
const store = new session.MemoryStore();

async function main () {
    async function getConnection () {
        const db = mysql.createConnection({
            host: process.env.CUSTOMCONNSTR_location,
            user: process.env.CUSTOMCONNSTR_username,
            password: process.env.CUSTOMCONNSTR_password,
            database: process.env.CUSTOMCONNSTR_databaseName
        });

        return new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(db)
                }
            })
        })
    }
    
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
            secure: false,
        },
        store: store,
    }))
    
    app.use(express.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", PORT === 3001 ? "http://localhost:3000" : "https://traveltour-frontend.onrender.com");
        res.header("Access-Control-Allow-Headers", "*");
        res.header('Access-Control-Allow-Credentials', true);
        res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE');
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    });
    
    app.listen(PORT, () => {console.log("Listening on port " + PORT)});
    app.use(express.static(path.join(__dirname, "..", "front-end", "build")));
    
    postDataBase = {};
    
    function sendBack(req, res, next) {
        res.status(200).sendFile(path.join(__dirname, "..", "front-end", "build", "index.html"));
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

    app.get("/api/isloggedIn", (req, res, next) => {
        if (req.session.authenticated) {
            res.send({user: req.session.user, status: "authenticated", store: store});
        }
        else {
            res.send({status: "not authenticated"});
        }
    })
    
    app.post("/api/add", (req, res, next) => {
        console.log("performed post");
        const newItem = req.body;
        const name = newItem.key;
        if (postDataBase[name] !== undefined) {
            postDataBase[name].unshift(newItem.list);
        }
        else {
            postDataBase[name] = [];
            postDataBase[name].unshift(newItem.list);
        }
        res.send(postDataBase);
    });
    
    app.delete("/api/delete", (req, res, next) => {
        console.log("performed delete");
        const itemKey = req.body.key;
        const location = req.body.location;
        postDataBase[location].splice(itemKey, 1);
        res.send(postDataBase);
    })
    
    app.put("/api/edit", (req, res, next) => {
        console.log("started edit");
        const result = req.body;
        const place = result.place;
        const index = result.index;
        postDataBase[place][index].editing = true;
        res.send(postDataBase);
    });
    
    app.post("/api/finishEdit", (req, res, next) => {
        console.log("finished edit");
        const result = req.body;
        const index = result.index;
        const place = result.place;
        const post = postDataBase[place][index];
        post.content = result.content;
        post.rating = result.rating;
        post.name = result.name;
        post.date = result.date;
        post.editing = false;
        res.send(postDataBase);
    });
    
    app.post("/api/register", async (req, res) => {
        const user = req.body.value;
        const pass = req.body.pass;
    
        let connection = await getConnection();
        try {
            let results = await connection.promise().query(`SELECT * FROM users WHERE username='${user}'`);
    
            if (results == null || results.length == 0 || results[0].length != 0) {
                return res.status(500).json({
                    message: `Cannot register because username ${user} already exists`
                })
            }
        } catch (err) {
            res.status(500).json({ message: err.message || 'Undefined error when checking username uniqueness' })
        } finally {
            connection.end()
        }

        connection = await getConnection();
        try {
            await connection.promise().query(`INSERT INTO users (username, password) VALUES(
                '${user}',
                '${pass}'
            )`)

            res.send({status: "success"});
        } catch (err) {
            res.status(500).json({ message: err.message || 'Undefined Error when inserting user' })
        } finally {
            connection.end()
        }
    });
    
    app.post("/api/login", async (req, res, next) => {
        const username = req.body.value;
        const password = req.body.pass;
        if (req.session.authenticated) {
            req.session.user = username;
            res.send({status: "logged in", data: req.sessionID});
        }
    
        else {
            let storedPassword = null;
            try {
                let db = await getConnection();
                let response = await db.promise().query(`SELECT * FROM users WHERE username='${username}'`);
                
                if (response.length >= 2) {
                    storedPassword = response[0][0].password;
                    if (storedPassword === password) {
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
                else {
                    res.send({status: "authentication error"});
                }
            }
            catch(err) {
                console.log(err);
                res.send({status: "authentication error"});
            }
        }
    });
}

main()
