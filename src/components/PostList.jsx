import React from "react";
import PostItem from './postItem';

const PostList = props => {
  const { posts } = props;

  return (
    <section>
      {posts.map(({ node }) => <PostItem post={node}/>)}
    </section>
  );
}

export default PostList;
