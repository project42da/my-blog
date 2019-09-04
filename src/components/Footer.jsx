import React from 'react';
import style from 'src/scss/components/footer.mod.scss';
import { useStaticQuery, graphql, Link } from "gatsby";

const query = graphql`
  {
    site {
      siteMetadata {
        author
      }
    }
  }
`;

const Footer = () => {
    const data = useStaticQuery(query);
    const { author } = data.site.siteMetadata;
    return(
        <footer className={style.footer}>
            <div className={style.inner}>
                <nav className={style.link_list}>
                    <Link to="/about" className={style.link}>소개</Link>
                    <Link to="/" className={style.link}>글 목록</Link>
                    <Link to="/tags" className={style.link}>태그</Link>
                </nav>
                <strong className={style.author}>© {new Date().getFullYear()} {author}</strong>    
            </div>
        </footer>
    );
}

export default Footer;