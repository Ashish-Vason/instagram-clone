import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Post from './Components/Post';
import { auth, db } from './Config/Firebase';
import './Styles/App.css';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './Components/ImageUpload';

import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const  [posts, setPosts] = useState([]);
  const  [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((authUser) => {
     if (authUser) {
       // user has logged in.
       console.log(authUser);
       setUser(authUser)

     } else {
       // user has logged out.
        setUser(null);
     }
   })

   return () => {
     //perform some clean up actions.
     unsubscribe();
   }

  }, [user, username])

  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // onsnapshot tracks all changes in the post all CRUD functionality.
      // every time a new post is added, this piece of code executes.
     setPosts(snapshot.docs.map(doc => ({
       id: doc.id,
       post :doc.data(),
      })))
    });
    
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
     return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch(error => alert(error.message))

    setOpen(false);
  } 

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message))

    setOpenSignIn(false);
  }
  

  return (
    <div className="app">
       <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
            className="app__headerImage"
            src="data:image/jpeg;base64,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"
            alt="ig-logo"
            />
            </center>
            
            <Input
             placeholder="Enter your username"
             type="text"
             value= {username}
             onChange= {(e) => setUsername(e.target.value)}
             />

             <Input
             placeholder="Enter your email"
             type="text"
             value= {email}
             onChange= {(e) => setEmail(e.target.value)}
             />

             <Input
              placeholder="Enter your password"
              type="password"
              value= {password}
              onChange= {(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
        </div>
      </Modal>

       <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
            className="app__headerImage"
            src="data:image/jpeg;base64,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"
            alt="ig-logo"
            />
            </center>
            
             

             <Input
             placeholder="Enter your email"
             type="text"
             value= {email}
             onChange= {(e) => setEmail(e.target.value)}
             />

             <Input
              placeholder="Enter your password"
              type="password"
              value= {password}
              onChange= {(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram" 
        />
        {user ? (
      <Button onClick= {() => auth.signOut()} >LogOut</Button>
      ):(
        <div className="app__loginContainer">
           <Button onClick= {() => setOpen(true)} >Sign Up</Button>
           <Button onClick= {() => setOpenSignIn(true)} >Sign In</Button>
        </div>      
      
     )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId ={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
          // render only the new post not the entire components because of the ids.
      }
        </div>
        <div className="app__postsRight">
        <InstagramEmbed
          url= 'https://www.instagram.com/p/B_uf9dmAGPw'
          maxwidth={320}
          hideCaption={false}
          containerTagName= 'div'
          protocol= ''
          injectScript ={true}
          onLoading={() => {}} 
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
          />
        </div>
      
      
      </div>

      {user?.displayName ? (
          <ImageUpload username={user.displayName} />
      ) : (
        <h3 className="app__h3">Please Login to upload posts.</h3>
      )}

     
      {/* Header */}

      </div>
  );
}

export default App;
