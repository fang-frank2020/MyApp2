import React from 'react';
import { useState } from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';

function Login() {
    const dev = process.env.NODE_ENV === "development";
    //for username
    const [user, setUser] = useState("");

    //for password
    const [pass, setPass] = useState("");

    const [loggedIn, setLoggedIn] = useState(false);
    const [hitSubmit, setHitSubmit] = useState(false);

    function handleNameChange(event) {
        if (hitSubmit) {
            setHitSubmit(false);
            loggedIn && setLoggedIn(false);
        }
        setUser(event.target.value);
    }

    function handlePassChange(event) {
        if (hitSubmit) {
            setHitSubmit(false);
            loggedIn && setLoggedIn(false);
        }
        setPass(event.target.value);
    }

    function handleLogin() {
        const result = fetch(dev ? "https://localhost:3001" : "https://travel-tour.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({value: user, pass: pass})
        })
        
        result
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setHitSubmit(true);
                if (data.status === "logged in") {
                    setLoggedIn(true);
                }
            })
    }


    return(
        <div>
            <Header />
            <div className="RegisterLoginWrapper">
                <div className="LoginRegisterTitle">
                    Login
                </div>
                <div className="UserNameWrapper">
                    <input className="RegisterInput" placeholder="Enter your username" onChange={(event) => handleNameChange(event)}/>
                </div>
                <div className="PasswordWrapper">
                    <input className="RegisterInput" placeholder="Enter your password" onChange={(event) => handlePassChange(event)}/>
                </div>
                <div className="ReminderRegister">
                    If this is your first time, please <Link to="/register">register</Link>
                </div>
                <div className="ExampleLogin">
                    <div>valid demo login: </div>
                    <div className="ExampleUserPass">
                        <div>username: user</div>
                        <div>password: 123</div>
                    </div>
                </div>
                <div className="SubmitLoginRegister">
                    <button className="LoginRegisterButton" onClick={() => {user !== "" && pass !== "" && handleLogin()}}>Submit</button>
                </div>
                <div className="SucessMessage">
                    {hitSubmit && loggedIn && <div>Congrats! You have successfully logged in.</div>}
                    {hitSubmit && !loggedIn && <div>Login details were incorrect. Please try again.</div>}
                </div>
            </div>
        </div>
    );
}

export default Login