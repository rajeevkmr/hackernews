import React from 'react';
import Img from 'react-image';
import LazyLoad from 'react-lazyload';

class Image extends React.Component {
    render() {
        let { src, className, alt, fallbackSrc, lazyload } = this.props;
        if (!className) className = '';
        const fallbackImg = <img src={fallbackSrc} alt="" />
        if (lazyload) {
            return <LazyLoad height="auto">
                <Img src={src} className={className} loader={fallbackImg} unloader={fallbackImg} alt={alt} />
            </LazyLoad>
        }
        return <Img src={src} className={className} loader={fallbackImg} unloader={fallbackImg} alt={alt} />
    }
}

export default Image;