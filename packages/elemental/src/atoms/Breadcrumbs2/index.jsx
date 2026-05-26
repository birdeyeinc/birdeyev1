import React from 'react';
import PropTypes from 'prop-types';
import './Breadcrumbs2.scss';

const BreadcrumbItemPropTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

const BreadcrumbPropTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(BreadcrumbItemPropTypes)).isRequired,
  className: PropTypes.string
};

const Breadcrumb = ({ items, className }) => {
  return (
    <nav className={`${className || ''} breadcrumbWrap`}>
      <ul>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.href && index !== items.length - 1 ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span
                  className={item.onClick ? 'customLinkWrap' : ''}
                  onClick={item.onClick}
                >
                  {item.label}
                </span>
              )}
            </li>
            {index !== items.length - 1 && (
              <li className="breadcrumbIconWrap"></li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

Breadcrumb.propTypes = BreadcrumbPropTypes;

export default Breadcrumb;
