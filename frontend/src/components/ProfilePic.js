import React, { useEffect, useState, useRef } from 'react'

export default function ProfilePic({changeprofile}) {
    const hiddenFileInput = useRef(null)

    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    // posting image to cloudinary
    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "dz5ni5rxu");
    
        fetch("https://api.cloudinary.com/v1_1/dz5ni5rxu/image/upload", {
            method: "POST",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // Log the full response
            if (data.url) {
                setUrl(data.url); // Set the URL if it's available
            } else {
                console.error("Cloudinary response did not include a URL:", data);
            }
        })
        .catch(err => console.error("Error uploading to Cloudinary:", err));
    };
    

    const postPic = () => {
        if (!url) {
            console.error("No URL available to update the profile picture.");
            return; // Exit if there's no URL
        }
    
        fetch("/uploadProfilePic", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ 
                pic: url
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // Log the response from the backend
            changeprofile(); // Update the parent component state
            window.location.reload(); // Optionally, reload the page
        })
        .catch(err => console.error("Error updating profile picture:", err));
    };
    

    const handleClick = () => {
        hiddenFileInput.current.click()
    };

    useEffect(() => {
        if (image) {
            postDetails()
        }
    }, [image])

    useEffect(()=>{
        if(url){
            postPic();
        }
    },[url])
    return (
        <div className='profilePic darkBg'>
            <div className="changePic centered">
                <div>
                    <h2>Change Profile Photo</h2>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='upload-btn' style={{ color: "#1EA1F7" }} onClick={handleClick}>Upload Photo</button>
                    <input type="file" ref={hiddenFileInput} accept='image/*' style={{ display: "none" }} onChange={(e) => { setImage(e.target.files[0]) }} />
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='upload-btn' style={{ color: "#ED4956" }} onClick={()=>{
                        setUrl(null);
                        postPic();
                    }} >Remove Current Photo</button>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button style={{ background: "none", cursor: "pointer", border: "none", fontSize: "15px" }} onClick={ changeprofile }>Cancel</button>
                </div>
            </div>
        </div>
    )
}
