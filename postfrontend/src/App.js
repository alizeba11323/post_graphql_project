import { useState } from "react";
import "./App.css";
import { gql, useQuery, useSubscription } from "@apollo/client";
import AddPost from "./AddPost";
const GET_ALL_POSTS = gql`
  query GET_ALL_POSTS {
    getAllPosts {
      _id
      body
      title
    }
  }
`;
const GET_CREATED_POST_SUBSCRIPTION = gql`
  subscription CREATE_POST_SUBSCRIPTION {
    postCreated {
      _id
      body
      title
    }
  }
`;
function App() {
  const [posts, setPosts] = useState([]);
  const { loading, error } = useQuery(GET_ALL_POSTS, {
    onCompleted: (data) => {
      setPosts(data?.getAllPosts);
    },
  });
  const res = useSubscription(GET_CREATED_POST_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      setPosts((prev) => [data?.postCreated, ...prev]);
    },
  });
  return (
    <>
      <div>
        {loading && "Loading...."}
        {error && error.message}
        {posts?.map((post) => (
          <div key={post._id}>{post.title}</div>
        ))}
        Post
      </div>
      <AddPost />
    </>
  );
}

export default App;
