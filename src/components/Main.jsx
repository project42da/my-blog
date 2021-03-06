import React from 'react';
import style from 'src/scss/components/main.mod.scss';

const Main = props => {
    const { children } = props;
    return(
        <main className={style.main}>
            {children}
        </main>
    )
}

export default Main;