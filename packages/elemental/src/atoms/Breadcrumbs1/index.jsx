import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'atoms/Tooltip';
import "./Breadcrumbs1.scss";

const BreadcrumbItem = ({ crumbVal, onClick, isLast }) => {
  let {label, enableTooltip = true, ellipsisCharLimit} = crumbVal;
  let charCountLimit = ellipsisCharLimit || 16;
  const modifiedLabel = label?.length > charCountLimit ? label?.slice(0, charCountLimit) + "..." : label;
  if (label?.length > charCountLimit && enableTooltip) {
      return (
          <Tooltip
              text={label}
              hideOnScroll
              position="bottom-right"
          >
              <span className={!isLast ? "breadcrumb-item" : ""}  onClick={isLast ? () => onClick() : () => {}}>{modifiedLabel}</span>
          </Tooltip>);
  } else {
      return <span className={!isLast ? "breadcrumb-item" : ""} onClick={isLast ? () => onClick() : () => {}}>{modifiedLabel}</span>;
  }
};

const Breadcrumb = ({ crumbs, onCrumbClick }) => {
  return (
    <div className="breadcrumb">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.label}>
              <BreadcrumbItem
                crumbVal={crumb}
                onClick={() => onCrumbClick(crumb)}
                isLast={isLast}
              />
            {!isLast && <span className="breadcrumb-separator"> {'>'} </span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Breadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCrumbClick: PropTypes.func.isRequired,
};

export default Breadcrumb;
