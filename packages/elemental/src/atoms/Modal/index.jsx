import React, { Component } from "react";
import ReactModal from "react-modal";
import PropTypes from "prop-types";
import { isFunction, merge, isEmpty } from "lodash";
import styles from "./Modal.module.scss";
import { gray0 } from "sass/js/colors";

const white = gray0;

const customStyles = {
  overlay: {
    backgroundColor: "rgba(33, 33, 33, 0.5)",
    overflow: "auto",
    zIndex: 9999,
  },
  content: {
    border: 0,
    background: white,
    margin: "0 auto",
    opacity: 1,
    position: "absolute",
    overflow: "initial",
    WebkitOverflowScrolling: "touch",
    borderRadius: 12,
    outline: "none",
    padding: "30px",
    zIndex: 99,
    top: 65,
    left: 0,
    right: 0,
    bottom: "auto",
    width: "92%",
    maxWidth: 650,
    boxShadow: "0 2px 7px 1px rgba(0, 0, 0, 0.1)",
  },
};

const ModalSizes = {
  extraSmall: {
    maxWidth: 320,
  },
  small: {
    maxWidth: 450,
  },
  medium: {
    maxWidth: 650,
  },
  large: {
    maxWidth: 850,
  },
  mediumLarge: {
    maxWidth: 1050,
  },
  extraLarge: {
    maxWidth: 1150,
  },
  megaLarge: {
    maxWidth: 1600,
  },
};

class Modal extends Component {
  static propTypes = {
    dialogOptions: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      style: PropTypes.shape({
        content: PropTypes.object,
        overlay: PropTypes.object,
      }),
      portalClassName: PropTypes.string,
      bodyOpenClassName: PropTypes.string,
      htmlOpenClassName: PropTypes.string,
      className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          base: PropTypes.string.isRequired,
          afterOpen: PropTypes.string.isRequired,
          beforeClose: PropTypes.string.isRequired,
        }),
      ]),
      overlayClassName: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          base: PropTypes.string.isRequired,
          afterOpen: PropTypes.string.isRequired,
          beforeClose: PropTypes.string.isRequired,
        }),
      ]),
      appElement: PropTypes.an,
      onAfterOpen: PropTypes.func,
      onRequestClose: PropTypes.func,
      closeTimeoutMS: PropTypes.number,
      ariaHideApp: PropTypes.bool,
      shouldFocusAfterRender: PropTypes.bool,
      shouldCloseOnOverlayClick: PropTypes.bool,
      shouldReturnFocusAfterClose: PropTypes.bool,
      parentSelector: PropTypes.func,
      aria: PropTypes.object,
      data: PropTypes.object,
      role: PropTypes.string,
      contentLabel: PropTypes.string,
      shouldCloseOnEsc: PropTypes.bool,
      overlayRef: PropTypes.func,
      contentRef: PropTypes.func,
    }),
    children: PropTypes.node,
    size: PropTypes.string,
    handleWindows: PropTypes.bool,
    smallCloseIcon: PropTypes.bool,
    modalUnmountsCb: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.dialogOptions.isOpen) {
      const scrollWidth =
        window.innerWidth - document.documentElement.clientWidth;
      this.handleBodyStyle(true, scrollWidth);
    }
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.dialogOptions.isOpen !== this.props.dialogOptions.isOpen) {
      const scrollWidth =
        window.innerWidth - document.documentElement.clientWidth;
      !newProps.dialogOptions.insideDrawer &&
        this.handleBodyStyle(newProps.dialogOptions.isOpen, scrollWidth);
    }
  };

  afterOpenModal = () => {
    const { afterOpenModal } = this.props.dialogOptions;
    if (isFunction(afterOpenModal)) {
      afterOpenModal();
    }
  };

  onCloseModal = (e) => {
    const { onCloseModal, insideDrawer } = this.props.dialogOptions;
    if (isFunction(onCloseModal)) {
      onCloseModal(e);
    }
    !insideDrawer && this.handleBodyStyle(false);
  };

  handleBodyStyle = (isModalOpen, scrollWidth) => {
    if (isModalOpen) {
      document.body.style.paddingRight = scrollWidth + "px";
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
  };

  componentWillUnmount = () => {
    const { insideDrawer } = this.props.dialogOptions;
    if (this.props.dialogOptions.isOpen && !insideDrawer) {
      this.handleBodyStyle(false);
    }
    this.props.modalUnmountsCb && this.props.modalUnmountsCb();
  };

  render() {
    const {
      children,
      dialogOptions,
      size,
      smallCloseIcon,
      handleWindows,
      ...otherProps
    } = this.props;
    const {
      shouldCloseOnEsc = true,
      showCloseIcon = false,
      title = "",
      isOpen,
      shouldCloseOnOverlayClick = true,
      dialogStyles = {},
      classes = {},
      closeIconId,
      customIcon = {},
      shouldFocusAfterRender,
    } = dialogOptions || {};

    const styleObj = merge({}, customStyles, dialogStyles);
    if (handleWindows) {
      let os = navigator.appVersion.indexOf("Win");
      if (os != -1) {
        ModalSizes[size] = {
          maxWidth: ModalSizes[size].maxWidth + 5,
        };
      }
    }
    Object.assign(styleObj.content, ModalSizes[size]);
    return (
      <ReactModal
        {...otherProps}
        isOpen={isOpen}
        ref={this.getRef}
        style={styleObj}
        shouldCloseOnEsc={shouldCloseOnEsc}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.onCloseModal}
        contentLabel={title}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        shouldFocusAfterRender={shouldFocusAfterRender}
      >
        {!isEmpty(customIcon) && (
          <span className={styles["custom-icon"]}>{customIcon}</span>
        )}
        {showCloseIcon ? (
          <i
            onClick={this.onCloseModal}
            data-testid="el-test-modal-close-icon"
            id={closeIconId ? closeIconId : "icon-reset"}
            className={`${styles['modal-close-icon']} icon_phoenix-reset ${
              styles[smallCloseIcon ? "small-close-icon" : "close-icon"]
            }`}
            style={classes.closeIcon ? classes.closeIcon : {}}
          />
        ) : (
          ""
        )}
        {children}
      </ReactModal>
    );
  }
}

export default Modal;
