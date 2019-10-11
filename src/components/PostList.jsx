import React from "react";
import PostItem from './postItem';

const PostList = props => {
  const { posts } = props;

  return (
    <section>
      {posts.map(({ node },index) => <PostItem key={index} post={node}/>)}
    </section>
  );
}

export default PostList;
