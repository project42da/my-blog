import React from 'react';
import style from 'src/scss/components/tag/tagItem.mod.scss';

const TagItem = props => {
    const { tag } = props;
    return (
        <li className={style.tag_item}>
            <a href="#" className={style.tag_item__name}>{tag}</a>
        </li>
    );
} 

export default TagItem;