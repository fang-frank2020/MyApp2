import React, { useEffect } from 'react';
import SinglePost from './SinglePost';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Cookies from 'js-cookie';


function Posts(props) {
    const windowUrl = window.location.origin;

    const nameCookie = Cookies.get("name");

    const [localData, setLocalData] = useState([]);
    const {id} = props;

    //make post states
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");

    //editing post states
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(0);
    const [editName, setEditName] = useState("");
    const [editDate, setEditDate] = useState("");

    const [editing, setEditing] = useState(false);  

    useEffect(() => {
        const result = fetch(windowUrl + "/api/getList",{
            method: "GET"
        });

        result
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setLocalData(data[id] !== undefined ? data[id] : []);
            })
    }, [id, windowUrl]);

    //adds post to postlist
    function handleSubmit(place) {

        var postReference = {
            content : content,
            rating : rating,
            name : name,
            date : date,
            delete: false,
            editing: false,
            username: nameCookie,
        };

        var addPackage = {
            key : place,
            list: postReference,
        };
        try {
            const send = fetch(windowUrl + "/api/add", {
                method: "POST",
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(addPackage),
            })

            send
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setLocalData(data[place] !== undefined ? data[place] : []);
            })
        }
        catch(error) {
            console.log(error.message);
        }
        
        setContent("");
        setRating(0);
        setName("");
        setDate("");
    }

    //deletes post
    function handleDelete(place, index) {
        try {
            const result = fetch(windowUrl + "/api/delete", {
                method: "DELETE",
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({key: index, location: place}),
            });

            result
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setLocalData(data[place]);
                })
        }
        catch(error) {
            console.log(error.message);
        }
    }

    //modifies editing to true for edited post
    //retrieves post that is being edited and sets relevant post data
    function startEdit(place, index) {
        try {
            const result = fetch(windowUrl + "/api/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({place: place, index: index}),
            })
    
            result
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    const item = data[place][index];
                    setEditContent(item.content);
                    setEditDate(item.date);
                    setEditRating(item.rating);
                    setEditName(item.name);
                    setLocalData(data[place]);
                })
        }
        catch(error) {
            console.log(error.message);
        }
        setEditing(true);
    }

    //puts edited data into database and changes existing values
    function handleEdit(content, rating, name, date, place, index) {
        const result = fetch(windowUrl + "/api/finishEdit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: content,
                rating: rating,
                name: name,
                date: date,
                place: place,
                index: index,
            }),
        });

        result
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setLocalData(data[id]);
            })
        setEditing(false);
    }

    //add one to index in the beginning of "localData.map..." to start a zero index
    var index = -1;
    return (
        <div>
            <div className="AddPost">
                <button className="AddText" onClick={() => handleSubmit(id)}><FaPlus /> <div className="PostText">Add Post</div></button>
            </div>
            <SinglePost content = {content} setContent={setContent} rating={rating}
            setRating={setRating} name={name} setName={setName} date={date} setDate={setDate}
            add={true} first={true} firstUserPost={false}/>
            {localData.map((item) => {
                index += 1;
                //currently editing post
                if (item.editing) {
                    return <SinglePost content = {editContent} setContent={setEditContent} rating={editRating}
                    setRating={setEditRating} name={editName} setName={setEditName} 
                    date={editDate} setDate={setEditDate}
                    add={true} deletePost={handleDelete} first={false} editing={editing} startEdit={startEdit} 
                    handleEdit={handleEdit} index={index} place={id} firstUserPost={false}
                    userName={item.username} key={index} />
                }
                //non edit posts
                return <SinglePost content = {item.content} setContent={setContent} rating={item.rating}
                    setRating={setRating} name={item.name !== "" ? item.name : "Anonymous User"} setName={setName} 
                    date={item.date !== "" ? item.date : "Unknown Date"} setDate={setDate}
                    add={false} deletePost={handleDelete} first={false} editing={editing} startEdit={startEdit}
                    handleEdit={handleEdit} index={index} place={id} firstUserPost={false} 
                    userName={item.username} key={index} />
            })}
        </div>
    );
}


export default Posts;