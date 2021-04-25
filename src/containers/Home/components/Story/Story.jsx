import React from 'react';
import Comment from '../Comment';
import {Link} from 'react-router-dom';
import './css/style.scss';

class Story extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storyComments: []
         };
    }

    componentDidUpdate() {
        const {story} = this.props;

    }

    render() {
       const {story} = this.props;
       let kids = [];
        kids = story.kids != undefined && story.kids.length > 0 && story.kids.slice(0, 20);
        return (
            <div className="row story">
                    <div className="px-4">
                        <h3><Link target="_blank" to={story.url}>{story.title}</Link></h3>
                        <div className="comments">
                            <Comment kids = {kids} id={story.id} />
                        </div>
                    </div>
            </div>
        );
    }
}

export default Story;