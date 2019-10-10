import React from "react";
import { graphql } from "gatsby";
import SEO from 'src/components/seo';
import Layout from 'src/components/layout';
import TagList from 'src/components/tag/tagList';
import style from 'src/scss/pages/tag.mod.scss';

const TagsPage = props => {
  const {
    data: {
      allMarkdownRemark: { group },
      site: {
        siteMetadata: { title },
      },
    },
  } = props;

  return (
    <Layout location={props.location} title={title}>
      <SEO title={'모든 태그 목록'} />
      <h1 className={style.title}>Tags</h1>
      <TagList tags={group}/>
    </Layout>
  );
};

export default TagsPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`