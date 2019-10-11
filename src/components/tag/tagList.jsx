import React from 'react';
import TagItem from 'src/components/tag/tagItem';
import style from 'src/scss/components/tag/tagList.mod.scss';

const TagList = props => {
    const { tags } = props;
    
    return (
        <ul className={style.tag_list}>
            {tags.map((tag, index) => (
                <TagItem tag={tag} key={index} />
            ))}
        </ul>
    );
} 

export default TagList;