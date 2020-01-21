import React from "react";
import { graphql } from 'gatsby';
import SEO from 'src/components/seo';
import Layout from 'src/components/layout';
import 'src/scss/global.scss';
import style from 'src/scss/pages/about.mod.scss';

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    },
    allMarkdownRemark {
      edges {
        node {
          id
          html
          excerpt(pruneLength: 160)
          frontmatter {
            title
          }
        }
      }
    }
  }
`;


const AboutPage = props => {
  const title = props.data.site.siteMetadata.title;
  const about = props.data.allMarkdownRemark.edges.filter(({node}) => node.frontmatter.title === 'about')[0].node;

  return (
    <Layout location={props.location} title={title}>
      <SEO title={'소개'} />
      <article className={style.about}>
        <h1 className={style.title}>소개</h1>
        <section className={style.about} dangerouslySetInnerHTML={{__html: about.html}}/>
        <hr/>
      </article>
    </Layout>
  );
};

export default AboutPage;