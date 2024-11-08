import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DetailedPost() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [post, setPost] = useAuth(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function fetchPost() {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      setPost(postSnapshot.data());
    }

    async function fetchComments() {
      const commentsRef = collection(db, "posts", postId, "comments");
      const commentsSnapshot = await getDocs(commentsRef);
      setComments(commentsSnapshot.docs.map((doc) => doc.data()));
    }

    fetchPost();
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.prevent.default();
    if (!newComment) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      content: newComment,
      author: currentUser.id,
      createdAt: new Date(),
    });

    setNewComment("");
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

      {/* Comments Section */}
      <h3>Comments</h3>
      <div className="comments">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment.content}</p>
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
