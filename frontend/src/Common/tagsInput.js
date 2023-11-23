import { useState } from 'react'

import { Image } from 'semantic-ui-react'


import "./tagsInput.css";

export function TagsInput(props){
    const [tags, setTags] = useState([])

    const [suggestedTags, setSuggestedTags] = useState(props.defaultSuggestedTags)

    function handleKeyDown(e){
        if(e.key !== 'Enter') return
        const value = e.target.value
        if(!value.trim()) return;
        if (!tags.includes(value)) {
            var newTags = [...tags, value];
            setTags(newTags);
            props.setTags(newTags.toString());
        }
        e.target.value = ''
    }

    function removeTag(index){
        if (props.defaultSuggestedTags.includes(tags[index])) {
            setSuggestedTags([...suggestedTags, tags[index]])
        }
        var newTags = tags.filter((el, i) => i !== index);
        setTags(newTags);
        props.setTags(newTags.toString());
    }

    function removeSuggestedTag(index){
        if (!tags.includes(suggestedTags[index])) {
            var newTags = [...tags, suggestedTags[index]];
            setTags(newTags);
            props.setTags(newTags.toString());
        }
        setSuggestedTags(suggestedTags.filter((el, i) => i !== index))
    }

    return (
        <div className="tags-input-container">
            { tags.map((tag, index) => (
                <div className="tag-item tag-item-selected" key={index}>
                    <span className="text">{tag}</span>
                    <i className="delete icon" aria-hidden="true"
                        onClick={() => removeTag(index)}
                        ></i>
                </div>
            )) }
            <input 
                onKeyDown={handleKeyDown} type="text" className="tags-input" 
                placeholder="Add your topics" 
                />

            { suggestedTags.map((tag, index) => (
                <div className="tag-item" key={index}
                    onClick={() => removeSuggestedTag(index)}
                    >
                    <span className="text">{tag}</span>
                </div>
            )) }
        </div>
    )
}