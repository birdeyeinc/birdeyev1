import React from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import './Carousel.scss';

const CarouselPropTypes = {
  slides: PropTypes.arrayOf(PropTypes.node).isRequired,
  extraSettings: PropTypes.any,
  className: PropTypes.string
};

const Carousel = ({ slides, extraSettings, className }) => {
  const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    ...extraSettings,
  };

  return (
    <div className={className || ''}>
      <Slider {...defaultSettings}>
        {slides.map((slide, index) => (
          <div key={index}>{slide}</div>
        ))}
      </Slider>
    </div>
  );
};

Carousel.propTypes = CarouselPropTypes;

export default Carousel;
