import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import {getTopStories, getStoryDetail} from 'services/hackernews';
import {addStories} from 'store/actions/hackernews';
import Story from './components/Story';
import './css/style.scss';

const PreloadItem = () => (
  <SkeletonTheme>
    <Skeleton height={185} />
    <div className="preload-item">
      <Skeleton height={55} width={55} style={{ borderRadius: 8 }} />
      <div className="preload-title">
        <Skeleton count={3} />
      </div>
    </div>

    <Skeleton count={5} />
  </SkeletonTheme>
);

const storyPreload = ({ items = 4, width = 1120, margin = 20 }) => {
  const itemWidth = Math.round((width - (items - 1) * margin) / items);
  return (
    <div style={{ width: width, display: 'flex', justifyContent: 'space-between', marginTop: 2 * margin, marginLeft: 'auto', marginRight: 'auto' }}>
      {[...Array(items).keys()].map((key) => (
        <div key={key} style={{ width: itemWidth }}>
          <PreloadItem />
        </div>
      ))}
    </div>
  );
};


@withTranslation('translations')
@connect(
  (state) => ({
    topStories: state.hackernews.topStories
  }),
  {addStories}
)
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      topStoriesIds: [],
      topStories: props.topStories || []
    };
    this.getStoryDetail = this.getStoryDetail.bind(this);
  }


  componentDidMount() {

    let topStories;
    try {
      topStories = JSON.parse(localStorage.getItem('story:collections'));
    } catch (ex) {
      console.log(ex);
    }
    console.log('====================================');
    console.log('topStories le', topStories);
    console.log('====================================');
    if (topStories?.length) {
      setTimeout(
        () =>
          this.setState({
            // loading: false,
            topStories
          }),
        500
      );
    } else {
      // no data, retry to get data
      this.getTopStories();
    }
  }

  componentDidUpdate() {
    this.state.topStories.length === 0 && this.getTopStories();
  }

  /*
   * get top 10 stories
  */

  getTopStories() {
    getTopStories().then(res=> {
      this.setState({topStoriesIds: res.slice(0, 10)}, () => {
        this.state.topStories.length === 0 && this.getStoryDetail();
      });
    });
  }

  /*
   * getStoriesDetail
   * param: story id
  */

  getStoryDetail() {
    const { topStoriesIds } = this.state;

    if(topStoriesIds.length > 0) {
      let story = [];
      topStoriesIds.map(storyId => {
        getStoryDetail(storyId).then(res => {
          story.push(res);
        });
      })
      this.setState({topStories: story});
      this.props.addStories(story);
      localStorage.setItem('story:collections', JSON.stringify(story));
    }
  }

  render() {
    const { t } = this.props;
    const {topStories} = this.state;
    return (
      <div className="home container ">
          <div className="heading pb-2 mb-4">
            <h3>Top Stories</h3>
          </div>
          {
            topStories.length > 0 ? topStories.map((story, i) => {
              return <Story story={story} key={i} />
            }):

            <storyPreload />
          }

      </div>
    );
  }
}

export default Home;
