import React from "react";
import { Link, graphql } from "gatsby";
import SEO from 'src/components/seo';
import Layout from 'src/components/layout';
import PostItem from 'src/components/postItem';
import style from 'src/scss/tagsTemplate.mod.scss';

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  
  return (
    <Layout location={location} title={`<c.init/>`}>
      <SEO title={`${tag} | 태그`} />
      <h2 className={style.title}>{tag}</h2>
      <span className={style.tag_result_count}>총 <strong>{totalCount}</strong>개</span>
      <ul>
        {edges.map(({ node }) => {
          return (
            <PostItem post={node}/>
          );
        })}
      </ul>
      {/*
        This links to a page that does not yet exist.
        We'll come back to it!
      */}
      <Link to="/tags">All tags</Link>
    </Layout>
  )
}

export default Tags;

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
            tags
          }
        }
      }
    }
  }
`