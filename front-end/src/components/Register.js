import React from 'react';
import { useState } from 'react';
import Header from './Header';
function Register() {
    const windowUrl = window.location.origin;

    //keeps track of username
    const [value, setValue] = useState("");

    //keeps track of password
    const [pass, setPass] = useState("");
    const [registered, setRegistered] = useState(false);
    const [hitSubmit, setHitSubmit] = useState(false);

    function handleNameChange(event) {
        if (hitSubmit) {
            setHitSubmit(false);
            registered && setRegistered(false);
        }
        setValue(event.target.value);
    }

    function handlePassChange(event) {
        if (hitSubmit) {
            setHitSubmit(false);
            registered && setRegistered(false);
        }
        setPass(event.target.value);
    }

    function handleRegister() {
        const result = fetch(windowUrl + "/api/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({value: value, pass: pass})
        });

        result
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setHitSubmit(true);
                data.status === "success" ? setRegistered(true) : setRegistered(false);
            })

    }


    return(
        <div>
            <Header />
            <div className="RegisterLoginWrapper">
                <div className="LoginRegisterTitle">
                    Register
                </div>
                <div className="UserNameWrapper">
                    <input className="RegisterInput" placeholder="Enter a username" onChange={(event) => handleNameChange(event)}/>
                </div>

                <div className="PasswordWrapper">
                    <input className="RegisterInput" placeholder="Enter your password" onChange={(event) => handlePassChange(event)}/>
                </div>
                <div className="SubmitLoginRegister">
                    <button className="LoginRegisterButton" onClick={() => {value !== "" && pass !== "" && handleRegister()}}>Submit</button>
                </div>
                <div className="SucessMessage">
                    {hitSubmit && registered && <div>Congrats! You have been successfully registered.</div>}
                    {hitSubmit && !registered && <div>This username is taken. Please try again.</div>}
                </div>
            </div>
        </div>
    );
}

export default Register;