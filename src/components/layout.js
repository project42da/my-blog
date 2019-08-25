import React from "react";
import Header from 'src/components/Header';
import Main from 'src/components/Main';
import Footer from 'src/components/Footer';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    return (
      <>
        <Header location={location} title={title}/>
        <Main children={children}/>
        <Footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </Footer>
      </>
    )
  }
}

export default Layout
