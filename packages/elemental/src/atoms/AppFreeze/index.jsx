import React from 'react';
import PropTypes from 'prop-types';
import './AppFreeze.scss';

const AppFreeze = (props) => {

    return props.enabled ? (
        <div className="freezer">
            <div className="freezerImage" />
        </div>
    ) : (
        <span />
    );
};

AppFreeze.propTypes = {
    enabled: PropTypes.bool.isRequired
};
export default AppFreeze;
