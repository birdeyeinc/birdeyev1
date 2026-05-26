import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import './CommonDrawer.scss';

const CommonDrawer = ({
  isOpen,
  title,
  children,
  onClose,
  width = '650px',
  shouldScroll = false, 
  headerRightContent,
  buttonPosition = 'right'
}) => {
  useEffect(() => {
    if(isOpen){
      document.body.style.overflow = "hidden";
    }
    return () => {
        document.body.style.overflow = "initial";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const overlayClasses = `overlay ${isOpen ? 'open' : ''}`;
  const drawerClasses = `side-drawer ${isOpen ? 'open' : ''}`;

  return (
    <>
      <div className={overlayClasses}>
        <div className={drawerClasses} style={{ width, overflowY: shouldScroll ? 'auto' : 'hidden' }}>
          <div className={`drawer-header ${buttonPosition === 'right' ? 'button-right' : 'button-left'}`}>
            {buttonPosition === 'left' && (
              <button onClick={() => onClose(false)} className="close-button">
                <div className="back-btn pull-left"><i className="icon-back-arrow"></i></div>
              </button>
            )}
            <h2>{title}</h2>
            {headerRightContent && (
              <>{headerRightContent}</>
            )}
            {!headerRightContent && buttonPosition === 'right' && (
              <button onClick={() => onClose(false)} className="close-button-right">
                <i className="icon-reset"/>
              </button>
            )}
          </div>
          <div className="drawer-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

CommonDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.string,
  shouldScroll: PropTypes.bool,
  headerRightContent: PropTypes.node,
  buttonPosition: PropTypes.oneOf(['right', 'left'])
};

export default CommonDrawer;
