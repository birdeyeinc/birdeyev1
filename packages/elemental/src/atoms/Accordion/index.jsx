import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Accordion.scss';
import DynamicAccordionComponent from './DynamicAccordion/DynamicAccordion';

const SingleAccordianItem = ({ data, isDefaultOpen, showCount}) => {
  const [clicked, setClicked] = useState(isDefaultOpen ? true : false);

  const handleToggle = () => {
    setClicked(prev => !prev);
  };



  return (
    <li className={clicked ? 'open' : ''}>
      <div className='accordionHeadingContent' onClick={handleToggle}>
        <span className={data.icon} />
        <h2>{data.title}</h2>
        {showCount && 
        <p className="el-contact-count ">
          {showCount.toLocaleString()}
        </p>}
        <i className='accordionIcon icon_phoenix-down-arrow' />
      </div>
      <div className='accordionBelowContent'>
        <span className='accordionInnerContent'>{data.content}</span>
      </div>
    </li>
  );
};

SingleAccordianItem.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    icon: PropTypes.any,
  }).isRequired,
  showCount: PropTypes.number,
  isDefaultOpen: PropTypes.bool
};

const Accordian = ({ items, isDefaultOpen, showCount }) => {
  console.log("Accordian", items, isDefaultOpen, showCount);
  return (
    <div>
      <ul className='accordionContentWrap'>
        {items.length &&
          items.map((item, idx) => {
            return <SingleAccordianItem key={idx} data={item} showCount={showCount} isDefaultOpen={isDefaultOpen}/>;
          })}
      </ul>
    </div>
  );
};

Accordian.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.any,
    })
  ).isRequired,
  showCount: PropTypes.number,
  isDefaultOpen: PropTypes.bool
};

export default Accordian;
export const DynamicAccordion = (props) => <DynamicAccordionComponent {...props}/>