import React, { useState } from "react";
import axios from "axios";

function CommentCreate({ postId }) {
  const [content, setContent] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    if (content === "") return;
    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="comment">New Comment</label>
          <input
            type="text"
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CommentCreate;
