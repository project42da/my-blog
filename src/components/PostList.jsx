import React from "react";
import { Link } from "gatsby";
import style from 'src/scss/components/postList.mod.scss';

const PostList = props => {
  const { posts } = props;

  return (
    <section>
      {posts.map(({ node:post }) => {
        const title = post.frontmatter.title || post.fields.slug;

        return (
          <article key={post.fields.slug} className={style.post_item}>
            <header>
              <h3 className={style.post_item__title}>
                <Link style={{ boxShadow: `none` }} to={post.fields.slug}>
                  {title}
                </Link>
              </h3>
              <time>{post.frontmatter.date}</time>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: post.frontmatter.description || post.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
    </section>
  )
}

export default PostList;
