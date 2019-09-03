import React from 'react';
import style from 'src/scss/components/tag/tagItem.mod.scss';
import { Link } from "gatsby";

const TagItem = props => {
    const { tag } = props;
    return (
        <li className={style.tag_item}>
            <Link to={`/tags/${tag.fieldValue}/`} className={style.tag_item__name}>
                {tag.fieldValue} ({tag.totalCount})
            </Link>
        </li>
    );
} 

export default TagItem;