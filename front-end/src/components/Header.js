import React from 'react';
import HeaderItem from './HeaderItem';
import Cookies from 'js-cookie';
import "./style.css";

function Header() {
    const name = Cookies.get("name");

    return (
        <>
            <div className="Header">
                <div className="First">
                    <HeaderItem value="TravelTour"/>
                </div>
                <div className="Rest">
                    <HeaderItem value="Home" />
                    <HeaderItem value="About" />
                    <HeaderItem value="My posts" />
                    {name === undefined && <HeaderItem value="Register" />}
                    {name !== undefined && <div className="HeaderItem">Logged in as "{name}"</div>}
                    {name === undefined && <HeaderItem value="Login" />}
                    {name !== undefined && <HeaderItem value="Logout"/>}
                    
                </div>
            </div>
        </>
    );
}

export default Header;



