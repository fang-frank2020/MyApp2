import React from 'react';
import Rating from './Rating';
import Content from './Content';
import { AiFillDelete } from 'react-icons/ai';
import Cookies from 'js-cookie';


function SinglePost(props) {

    const cookieName = Cookies.get("name");

    const {content, setContent, rating, setRating, name, setName,
        date, setDate, add, deletePost, first, editing,
        startEdit, handleEdit, index, place, firstUserPost, userName} = props;

    
    const matches = cookieName === userName && userName !== undefined;

    async function handleNameChange(event) {
        await setName(event.target.value);
    }

    async function handleDateChange(event) {
        await setDate(event.target.value);
    }

    return (
        <div>
            <div>
                {firstUserPost && <div className="PlaceName">Posts from {place}: </div>}
            </div>
            <div className="OutsideBorder">
                <div className="PostWrapper">
                    <div className="UpperHalf">
                        <div className="ProfileIcon">
                            <img className="ProfileImage" src="https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067_640.png" alt="profile-icon"></img>
                        </div>
                        <div className="FirstUserPostLocation">
                        </div>
                        <div className="NameLocationContainer">
                            <div className="UserName">
                                {add ? <input id="NameInput" className="NameContainer" placeholder='Name' onChange={handleNameChange} value={name}/>
                                : <div className="OutputName">{name}</div>}
                            </div>
                            <div className="Time">
                                {add && <input id="DateInput" placeholder='Date (MM/DD/YYYY)' onChange={handleDateChange} value={date}/>}
                                {!add && <div className="OutputDate">{date}</div>}
                            </div>
                        </div>
                        <div className="EditWrapper">
                            {!add && matches && <button className="Edit" onClick={async () => !editing && await startEdit(place, index)}>Edit</button>}
                            {add && !first && matches && <button className="Edit" onClick={async () => await handleEdit(content, rating, name, date, place, index)}>Finished Edit</button>}
                        </div>
                        <div className="RemoveIconWrapper">
                            {!first && matches && <AiFillDelete size={"1.5rem"} cursor={"pointer"} onClick={async () => {await deletePost(place, index)}}/>}
                        </div>
                    </div>
                    <Rating rating={rating} setRating={setRating} add={add}/>
                    <Content content={content} setContent={setContent} add={add}/>
                </div>
            </div>
        </div>
    );
}

export default SinglePost;