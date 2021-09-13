import React, {useState, useEffect} from 'react'
import { Avatar, Button } from "@material-ui/core";
import '../Styles/Post.css'
import { db } from '../Config/Firebase';
import firebase from 'firebase';

function Post({username, user, imageUrl, caption, postId}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');


    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        }

    }, [postId])

    const postComment= (e) => {
        e.preventDefault();

        db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }
    

    return (
        <div className="post">
            <div className="post__header">
            <Avatar 
            className="post__avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"
            />
            <h3>{username}</h3>

            </div>

            {/* header -> avatar + username */}

            <img
            className="post__image"
             src={imageUrl} alt="React Logo" />
            {/* image */}

            <h4 className="post__text"><strong>{username}: </strong>{caption}</h4>
            {/* Username + caption */}

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}:</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                <input
                className="post__input"
                type="text"
                placeholder="Add a comment..."
                value= {comment}
                onChange = {(e) => setComment(e.target.value)}
                />
                <Button
                disabled= {!comment}
                className = 'post__button'
                type="submit"
                onClick={postComment}

                >Post</Button>
            </form>
            )}

            
        </div>
    )
}


export default Post;
     