import React from "react";
import { Link } from "gatsby";

const PostList = props => {
  const { posts } = props;

  return (
    <div>
      {posts.map(({ node:post }) => {
        const title = post.frontmatter.title || post.fields.slug
        return (
          <article key={post.fields.slug}>
            <header>
              <h3>
                <Link style={{ boxShadow: `none` }} to={post.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{post.frontmatter.date}</small>
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
    </div>
  )
}

export default PostList;
