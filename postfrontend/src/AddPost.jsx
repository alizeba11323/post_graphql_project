import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
const CREATE_POST = gql`
  mutation CREATE_POST($title: String!, $body: String!) {
    createPost(title: $title, body: $body) {
      body
      title
    }
  }
`;
function AddPost() {
  const [addPost, { loading, error }] = useMutation(CREATE_POST);
  const [data, setData] = useState({
    title: "",
    body: "",
  });
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = () => {
    addPost({
      variables: {
        title: data.title,
        body: data.body,
      },
    });
  };
  return (
    <div>
      <input
        type="text"
        name="title"
        value={data.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="body"
        value={data.body}
        onChange={handleChange}
      />
      <button onClick={handleClick}>
        {loading ? "Loading..." : "Add Post"}
      </button>
    </div>
  );
}

export default AddPost;
