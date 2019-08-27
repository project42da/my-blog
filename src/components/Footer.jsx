import React from 'react';
import style from 'src/scss/components/footer.mod.scss';

const Footer = props => {
    const { children } = props;
    return(
        <footer className={style.footer}>
            <div className={style.inner}>
                {children}
            </div>
        </footer>
    )
}

export default Footer;