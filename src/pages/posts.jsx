import React from 'react';
import { graphql } from 'gatsby';
import PostList from 'src/components/postList';
import Layout from 'src/components/layout';
import SEO from 'src/components/seo';
import 'src/scss/global.scss';

class PostPage extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    let posts = [];
    if (data.allMarkdownRemark.edges) {
      posts = data.allMarkdownRemark.edges.filter(({ node }) =>
        node.frontmatter.title !== 'about');
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title='모든 게시물' />
        <span className={'result_count'}>총 <strong>{posts.length}</strong>개</span>
        <PostList posts={posts} /> {/* 컨텐츠 커플링 */}
      </Layout>
    )
  }
}

export default PostPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
          }
        }
      }
    }
  }
`
