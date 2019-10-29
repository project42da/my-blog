import React from 'react';
import { Link } from "gatsby";
import PostItemTag from 'src/components/PostItemTag';
import style from 'src/scss/components/postItem.mod.scss';
import "katex/dist/katex.min.css";

const PostItem = props => {
  const { post } = props;
  const title = post.frontmatter.title || post.fields.slug;

  return (
    <article key={post.fields.slug} className={style.post_item}>
      <header>
        <strong className={style.post_item__title}>
          <Link style={{ boxShadow: `none` }} to={post.fields.slug} className={style.post_item__link}>
            {title}
          </Link>
        </strong>
        <time className={style.post_item__time}>{post.frontmatter.date}</time>
      </header>
      <section>
        <ul className={style.post_item__tag_list}>
          {post.frontmatter.tags && post.frontmatter.tags.map((tag,index) => <PostItemTag tag={tag} key={`${tag}-${index}`}/>)}
        </ul>
      </section>
    </article>
  );
}

export default PostItem;