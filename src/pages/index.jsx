import React from 'react';
import { graphql } from 'gatsby';
import PostList from 'src/components/postList';
import Layout from 'src/components/layout';
import SEO from 'src/components/seo';
import TagList from 'src/components/tag/tagList';
import 'src/scss/global.scss';

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;

    let tags = posts.reduce((acc, { node:post }) => {
      const result = post.frontmatter.description.split(' ');
      return [...acc, ...result]
    }, []);

    tags = new Set(tags);

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title='모든 게시물' />
        <TagList tags={tags}/>
        <PostList posts={posts}/> {/* 컨텐츠 커플링 */}
      </Layout>
    )
  }
}

export default BlogIndex;

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
            description
          }
        }
      }
    }
  }
`
