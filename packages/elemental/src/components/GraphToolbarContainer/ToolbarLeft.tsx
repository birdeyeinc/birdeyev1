import React from "react";
import styles from "./GraphToolbarContainer.module.scss";

export interface GraphToolbarLeftConfig {
  isVisible?: boolean;
  title?: string | React.ReactNode;
  titleCustomClass?: string;
  childrenJSX?: React.ReactNode;
}

const GraphToolbarLeft: React.FC<GraphToolbarLeftConfig> = ({
  title,  
  titleCustomClass,
  childrenJSX,
}) => {
  return (
    <div className={titleCustomClass || styles["graph-toolbar-title"]}>
      {title && <span>{title}</span>}
      {childrenJSX}
    </div>
  );
};

export default GraphToolbarLeft;
