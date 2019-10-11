import React from 'react';
import { Link } from 'gatsby';
import style from 'src/scss/components/PostItemTag.mod.scss';

const PostItemTag = props => {
  const { tag } = props;
  return (
    <li className={style.tag}>
      <Link to={`/tags/${tag}/`} className={style.tag_link}>{tag}</Link>
    </li>
  )
}

export default PostItemTag;
