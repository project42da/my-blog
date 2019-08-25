import React from "react";
import { Link } from "gatsby";
import style from 'src/scss/components/Header.mod.scss';

class Header extends React.Component {
    render() {
        const { location, title } = this.props;
        const rootPath = `${__PATH_PREFIX__}/`;
        let header;

        if (location.pathname === rootPath) {
            header = (
                <Link to={`/`}><h1>{title}</h1></Link>
            )
        } else {
            header = (
                <Link to={`/`}><h1>{title}</h1></Link>
            )
        }
        return <header className={style.header}>{header}</header>;
    }
}

export default Header
