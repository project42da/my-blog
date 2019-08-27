import React from "react";
import { Link } from "gatsby";
import style from 'src/scss/components/header.mod.scss';

class Header extends React.Component {
    render() {
        const { location, title } = this.props;
        const rootPath = `${__PATH_PREFIX__}/`;
        let header;

        if (location.pathname === rootPath) {
            header = (
                <Link to={`/`} className={style.link}><h1 className={style.logo}>{title}</h1></Link>
            )
        } else {
            header = (
                <Link to={`/`} className={style.link}><h1 className={style.logo}>{title}</h1></Link>
            )
        }
        return (
            <header className={style.header}>
                <div className={style.inner}>
                    {header}
                </div>
            </header>
        );
    }
}

export default Header
