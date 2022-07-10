import React from "react";
import Slider from "react-slick";
import { getCatalogCDNURL } from "../../utils";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={`${className}`} style={style} onClick={onClick}>
      <img src="/images/icon/prev-image.svg" alt="previous" />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={`${className}`} style={style} onClick={onClick}>
      <img src="/images/icon/next-image.svg" alt="next" />
    </div>
  );
};

export default class ImageSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainSlider: null,
      navSlider: null,
    };
  }

  componentDidMount() {
    this.setState({
      mainSlider: this.mainSlider,
      navSlider: this.navSlider,
    });
  }

  render() {
    const isSingle = this.props.images && this.props.images.length === 1;

    const mainSettings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      draggable: false,
      asNavFor: !isSingle && this.state.navSlider,
      autoplay: false,
      className: "large-view-slide",
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };

    const smallSettings = {
      slidesToShow:
        this.props.images && this.props.images.length > 5
          ? 5
          : this.props.images.length,
      slidesToScroll: 1,
      asNavFor: this.state.mainSlider,
      dots: false,
      draggable: false,
      autoplay: false,
      centerMode: true,
      focusOnSelect: true,
      className: "small-view slick-slider-nav",
    };

    return (
      <>
        <Slider {...mainSettings} ref={(slider) => (this.mainSlider = slider)}>
          {this.props.images &&
            this.props.images.map((item, index) => (
              <div key={item.Key} className="item">
                <img
                  src={getCatalogCDNURL(null, item.Key)}
                  className="w-100"
                  style={{ height: 500, objectFit: "contain" }}
                  alt={`product ${index}`}
                  draggable="false"
                  srcSet={`${getCatalogCDNURL(
                    null,
                    item.Key
                  )} 1024w, ${getCatalogCDNURL(
                    null,
                    item.Key
                  )}?size=640 640w, ${getCatalogCDNURL(
                    null,
                    item.Key
                  )}?size=320 320w`}
                  sizes="(min-width: 36em) 33.3vw, 100vw"
                />
              </div>
            ))}
        </Slider>
        {!isSingle && (
          <Slider
            {...smallSettings}
            ref={(slider) => (this.navSlider = slider)}
          >
            {this.props.images &&
              this.props.images.map((item, index) => (
                <div key={item.Key} className="item">
                  <img
                    src={getCatalogCDNURL(null, item.Key)}
                    className="image-fluid w-100"
                    style={{ height: 100, objectFit: "cover", margin: "auto" }}
                    alt={`product ${index}`}
                    draggable="false"
                    srcSet={`${getCatalogCDNURL(
                      null,
                      item.Key
                    )} 1024w, ${getCatalogCDNURL(
                      null,
                      item.Key
                    )}?size=640 640w, ${getCatalogCDNURL(
                      null,
                      item.Key
                    )}?size=320 320w`}
                  />
                </div>
              ))}
          </Slider>
        )}
      </>
    );
  }
}
