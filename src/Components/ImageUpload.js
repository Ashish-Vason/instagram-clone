import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from '../Config/Firebase';
import firebase from 'firebase'
import '../Styles/ImageUpload.css'

function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);

    const handleChange= (e) => {
        if (e.target.files) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //  progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },

            (error) => {
                // error function.
                console.log(error);
            },
            () => {
                // Complete Function
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //Post images in db.

                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl : url,
                        username: username
                    })

                    setProgress(0);
                    setCaption("");
                    setImage("");
                })
            }
        )
    }
    return (
        <div className="imageupload">
      {/* I want to have... */}
      {/* Caption input */}
      {/* File Picker */}
      {/* Post Button */}

      <progress className="imageupload__progress" value={progress} max="100" />
      <input type="text" placeholder="Enter a Caption.." onChange={event => setCaption(event.target.value)} value = {caption} />
      <input type="file" onChange={handleChange}  />
      <Button className="imageupload__button" onClick={handleUpload}>
          Upload
      </Button>
       
        </div>
    )
}

export default ImageUpload;