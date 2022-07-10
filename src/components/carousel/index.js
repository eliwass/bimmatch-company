import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { getCatalogCDNURL } from "../../utils";

function ImageCarousel({ images }) {
  const [index, setIndex] = React.useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      activeIndex={index}
      nextIcon={
        <img
          alt="next"
          height="40px"
          width="40px"
          src="/images/icon/next.svg"
        />
      }
      nextLabel=""
      prevIcon={
        <img
          alt="next"
          height="40px"
          width="40px"
          src="/images/icon/prev.svg"
        />
      }
      prevLabel=""
      onSelect={handleSelect}
    >
      {images &&
        images.map((item, index) => (
          <Carousel.Item key={item.Key}>
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
          </Carousel.Item>
        ))}
    </Carousel>
  );
}

export default ImageCarousel;
