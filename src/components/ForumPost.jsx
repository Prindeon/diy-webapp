import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, increment, deleteDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

function DetailedPost() {
    const { postId } = useParams();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [sortOption, setSortOption] = useState("newest");

    // Function to retrieve comments from Firestore
    async function fetchComments() {
        const commentsRef = collection(db, "posts", postId, "comments");
        const commentsSnapshot = await getDocs(commentsRef);

        // Map over comments and handle missing createdAt fields
        const commentsList = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Sort based on selected option
        if (sortOption === "newest") {
            commentsList.sort((a, b) => {
                // Check if createdAt exists; if not, use default Date for comparison
                const dateA = a.createdAt ? a.createdAt.seconds : 0;
                const dateB = b.createdAt ? b.createdAt.seconds : 0;
                return dateB - dateA;
            });
        } else if (sortOption === "mostLiked") {
            commentsList.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        }

        setComments(commentsList);
    }

    useEffect(() => {
        async function fetchPost() {
            const postRef = doc(db, "posts", postId);
            const postSnapshot = await getDoc(postRef);
            if (postSnapshot.exists()) {
                setPost(postSnapshot.data());
            } else {
                console.log("No such post!");
            }
        }

        fetchPost();
        fetchComments();
    }, [postId, sortOption]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment) return;

        const authorName = currentUser.displayName || 'Anonymous';
        const authorProfilePic = currentUser.photoURL || 'default_profile_picture.png';

        await addDoc(collection(db, "posts", postId, "comments"), {
            content: newComment,
            author: currentUser.uid,
            authorName,
            authorProfilePic,
            createdAt: new Date(),
            likes: 0,
            likedBy: [],
        });

        setNewComment("");
        fetchComments(); // Refresh comments after posting
    };

    const handleLikeComment = async (commentId, likedBy = []) => {
        const commentRef = doc(db, "posts", postId, "comments", commentId);

        if (likedBy.includes(currentUser.uid)) {
            // Unlike: Remove user ID from likedBy array and decrement likes
            await updateDoc(commentRef, { 
                likedBy: arrayRemove(currentUser.uid),
                likes: increment(-1) 
            })
        }   else {
            // Like: Add user ID to likedBy array and increment likes
            await updateDoc(commentRef, {
                likedBy: arrayUnion(currentUser.uid),
                likes: increment(1)
            })
        }

        fetchComments(); // Refresh to show updated like count
    };

    const handleDeleteComment = async (commentId) => {
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        await deleteDoc(commentRef);
        fetchComments(); // Refresh to remove deleted comment
    };

    return (
        <div className="post-detail">
            {post && (
                <>
                    <h2>{post.title}</h2>
                    {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
                    <p>{post.content}</p>
                    <p>Likes: {post.likes}</p>
                </>
            )}

            <h3>Comments</h3>

            {/* Dropdown to select sorting */}
            <label>
                Sort by:
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="mostLiked">Most Liked</option>
                </select>
            </label>
            
            <div className="comments">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <Link to={`/user/${comment.author}`}>
                            <div className="comment-header">
                                <img
                                    src={comment.authorProfilePic || 'default_profile_picture.png'}
                                    alt="Profile"
                                    className="comment-profile-pic"
                                />
                                <div>
                                    <p className="comment-author">{comment.authorName}</p>
                                    <p className="comment-time">
                                        {comment.createdAt 
                                            ? new Date(comment.createdAt.seconds * 1000).toLocaleString() 
                                            : "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <p className="comment-content">{comment.content}</p>
                        <div className="comment-actions">
                            <button onClick={() => handleLikeComment(comment.id, comment.likedBy)}>
                                {comment.likedBy && comment.likedBy.includes(currentUser.uid) ? "Unlike" : "Like"} ({comment.likes || 0})
                            </button>
                            {comment.author === currentUser.uid && (
                                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddComment}>
                <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit">Add Comment</button>
            </form>
        </div>
    );
}

export default DetailedPost;