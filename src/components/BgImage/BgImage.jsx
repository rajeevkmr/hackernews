import React from 'react';
import LazyLoad from 'react-lazyload';

class BgImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false
    };
    this.onImageLoad = this.onImageLoad.bind(this);
  }

  onImageLoad() {
    this.setState({ imageLoaded: true });
  }

  render() {
    let { src, className, fallbackSrc, lazyload, width, height, imgStyle } = this.props;
    const { imageLoaded } = this.state;
    fallbackSrc = fallbackSrc || '/images/item-default.svg';
    if (!className) className = '';
    if (width && height) {
      src = `${src}=w${width}-h${height}-n`;
    }
    const imgSrc = imageLoaded ? src : fallbackSrc;
    const component = (
      <div style={{ position: 'relative' }}>
        <div
          className={`bg-img ${className} ${imageLoaded ? '' : 'default-img'}`}
          style={{
            backgroundImage: `url(${imgSrc})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: `${imageLoaded ? '' : '#F2FFFF'}`,
            backgroundSize: `${imageLoaded ? 'cover' : ''}`,
            width: width,
            height: height,
            ...imgStyle
          }}
        ></div>
        <img src={src} onLoad={this.onImageLoad} alt="" style={{ position: 'absolute', visibility: 'hidden' }} />
      </div>
    );
    return lazyload ? <LazyLoad height={height}>{component}</LazyLoad> : component;
  }
}

export default BgImage;
