import React from 'react';
import "./style.css";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function HeaderItem({ value, dropdown }) {

    function handleReset() {
        Cookies.remove("name");
        Cookies.remove("cookieMonster");
    }
    return (
        <>
            {value === "Logout" && <Link className={!dropdown ? "HeaderItem" : "DropDown"} onClick={() => handleReset(value)} reloadDocument to="/">{value}</Link>}
            {value === "TravelTour" && <Link className="First" to="/"> {value} </Link>}
            {(value === "Home") && <Link className={!dropdown ? "HeaderItem" : "DropDown"} to="/"> {value} </Link>}
            {(value === "My posts") && <Link className={!dropdown ? "HeaderItem" : "DropDown"} to="/myPosts">{value}</Link>}
            {value !== "Home" && value !== "TravelTour" && value !== "My posts" && value !== "Logout" && <Link className={!dropdown ? "HeaderItem" : "DropDown"} to={"/"+value.toLowerCase()}>{value} </Link>}
        </>
    );
}

export default HeaderItem;