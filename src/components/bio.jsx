import React from "react";
import { useStaticQuery, graphql } from "gatsby";
// import Image from "gatsby-image";
import style from 'src/scss/components/bio.mod.scss';

const query = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 36, height: 36) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        description
      }
    }
  }
`;

const Bio = () => {
  const data = useStaticQuery(query);
  const { author, description } = data.site.siteMetadata;

  return (
    <div className={style.bio}>
      {/* <Image
        className={style.bio_thumb}
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        imgStyle={{
          borderRadius: `50%`,
        }}
      /> */}
      <div className={style.bio_content}>
        <strong>{author}</strong>
        <p className={style.bio_description}>{description}</p>
      </div>
    </div>
  );
}

export default Bio;
