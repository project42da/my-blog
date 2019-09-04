import React from "react";
import Header from 'src/components/header';
import Main from 'src/components/main';
import Footer from 'src/components/footer';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    return (
      <>
        <Header location={location} title={title}/>
        <Main children={children}/>
        <Footer/>
      </>
    )
  }
}

export default Layout;
