import React from 'react';
import { connect } from 'react-redux';
import { getComment } from 'services/hackernews';
import {addComments} from 'store/actions/hackernews';
import './css/style.scss';

@connect(
    (state) => ({
        topStories: state.hackernews.topStories,
        comments: state.hackernews.comments
    }),
    {addComments}
  )
class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storyComments: []
          };
    }

    componentDidUpdate() {
        const {kids, id, comments} = this.props;

        let commentDetail = [];
        console.log('====================================');
        //console.log('comments[id]', );
        let findComment = Object.keys(comments).find(stotyId=>stotyId == id);
        if(findComment == undefined) {
            kids.length > 0 && kids.map(commentId => {
                getComment(commentId).then(res => {
                    commentDetail.push(res);
                });
            });
            this.props.addComments({[id]: commentDetail});
        }

    }

    render() {
        const {id, comments} = this.props;
        return (
            <React.Fragment>
                {
                    (comments[id] != undefined && comments[id].length > 0) ? comments[id].map((comm, i) => {
                        return <div className="comment" key={i}>{comm.text}</div>;
                    }):
                    <div className="comment">No comment available!</div>
                }
            </React.Fragment>
        );
    }
}

export default Comment;