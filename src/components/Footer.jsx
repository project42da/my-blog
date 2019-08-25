import React from 'react';
import style from 'src/scss/components/Footer.mod.scss';

const Footer = props => {
    const { children } = props;
    return(
        <footer className={style.footer}>{children}</footer>
    )
}

export default Footer;