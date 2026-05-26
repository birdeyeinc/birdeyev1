import React from 'react'
import PropTypes from "prop-types";
import style from "./Avatar.module.scss";
import AvatarLogo from './logo';

function Avatar(props) {
  const { type } = props;
  if (type === 'LOGO') {
    return (<AvatarLogo {...props} />)
  } else {
    const {
      alt,
      children: childrenProp,
      classes,
      imgProps,
      size = "small",
      styleObj,
      src,
      variant,
    } = props;
    if (src && !alt) throw new Error("Please provide 'alt' text for an image");

    let children = null;
    let hasImg = false;

    if (src) {
      hasImg = true;
      children = (
        <img
          src={src}
          alt={alt}
          {...imgProps}
          className={`${classes?.img ?? ""} ${style.img}`}
        />
      );
    } else if (!!childrenProp || childrenProp === 0) {
      children = childrenProp;
    } else if (alt) {
      children = alt[0]?.toUpperCase();
    } else {
      throw new Error("Please pass src or any children prop to render Avatar");
    }

    return (
      <div
        style={styleObj}
        className={`el-avatar ${classes?.root ?? ""} ${style.avatar} ${style["avatar--" + size]
          } ${style["avatar--" + variant]} ${!hasImg ? style.defaultcolor : ""}`}
      >
        {children}
      </div>
    );
  }
}

Avatar.propTypes = {
  /** Alternative text for the image. */
  alt: PropTypes.string,
  /** Content to display inside the avatar (e.g., initials). */
  children: PropTypes.node,
  /** Custom class names for styling. */
  classes: PropTypes.object,
  /** Additional properties for the <img> tag. */
  imgProps: PropTypes.object,
  /** Size of the avatar. Can be small, medium, or large. */
  size: PropTypes.oneOf(["extra-small", "small", "medium", "large"]),
  /** Inline styles for the avatar. */
  styleObj: PropTypes.object,
  /** Source URL for the avatar image. */
  src: PropTypes.string,
  /** Shape of the avatar: circular, rounded, or square. */
  variant: PropTypes.oneOf(["circular", "rounded", "square"]),
  /** Type of avatar: IMAGE or USERNAME. */
  type: PropTypes.oneOf(["DEFAULT", "LOGO"]),
  /** User name for the avatar. */
  userName: PropTypes.string,
  /** Show last name in the avatar. */
  showLastname: PropTypes.bool,
  /** Custom class name for the avatar. */
  customStyleClassName: PropTypes.string,
};
Avatar.defaultProps = {
  type: "DEFAULT"
}

export default Avatar;
