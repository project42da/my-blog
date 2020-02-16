import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import style from 'src/scss/components/postTemplate.mod.scss';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const { previous, next } = this.props.pageContext;
    const metaDiscription = `${post.frontmatter.title} ${post.frontmatter.tags ? post.frontmatter.tags.toString() : ''} ${post.frontmatter.description ? post.frontmatter.description : ''} ${post.excerpt}`;
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={ metaDiscription }
          keyword={post.frontmatter.keyword || ''}
        />
        <article className={style.wrap}>
          <header className={style.header}>
            <h1 className={style.title}>{post.frontmatter.title}</h1>
            <time className={style.time}>{post.frontmatter.date}</time>
          </header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr/>
        </article>

        <div className={style.page_move_area}>
          {previous && (
            <Link to={previous.fields.slug} rel="prev" className={style.page_move_prev}>
              ← {previous.frontmatter.title}
            </Link>
          )}
        
          {next && next.frontmatter.title !== 'about' && (
            <Link to={next.fields.slug} rel="next" className={style.page_move_next}>
              {next.frontmatter.title} →
            </Link>
          )}
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        keyword
        tags
        category
      }
    }
  }
`;
