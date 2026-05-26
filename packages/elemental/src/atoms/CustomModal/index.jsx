import { useEffect } from "react";
import React from "react";
import PropTypes from "prop-types";
import "./index.scss";
import Modal from "atoms/Modal";
import Button from "atoms/Button";

let validThemes = ["primary", "secondary", "link", "super", "danger", "danger-primary", "noBorder", "errorlink"];

const CustomModal = ({
  title,
  subtitle,
  onHideModal,
  onHandleChangeModal,
  needPrimaryBtn,
  primaryBtnLabel,
  primaryBtnDisabled,
  needSecondaryBtn,
  secondaryBtnLabel,
  secondaryBtnDisabled,
  children,
  primaryBtnTheme,
}) => {
  const dialogOptions = {
    isOpen: true,
    showCloseIcon: true,
    title,
    dialogStyles: {
      content: {
        width: 450,
        bottom: "unset",
        left: "52.5%",
        top: "60px",
        marginLeft: `-${516 / 2}px`,
        padding: 30,
        border: 0,
      },
    },
    hideCrossButton: false,
    onCloseModal: onHideModal,
  };

  useEffect(() => {
    return () => {
      document.body.removeAttribute("class");
    };
  }, []);
  
  return (
    <Modal dialogOptions={dialogOptions}>
      <div className="custom-modal-filter">
        <div className="tag-modal-title">{title}</div>
        <div className="modal-subtitle">{subtitle}</div>
        {children}
        <div className="btnWrapper">
          {needSecondaryBtn && (
            <Button
              onClick={onHideModal}
              label={secondaryBtnLabel || "Cancel"}
              theme="link"
              disabled={secondaryBtnDisabled || false}
            />
          )}

          {needPrimaryBtn && (
            <Button
              onClick={onHandleChangeModal}
              label={primaryBtnLabel || "Apply"}
              theme={primaryBtnTheme || "primary"}
              disabled={primaryBtnDisabled || false}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

CustomModal.defaultProps = {
  primaryBtnLabel: "Save",
  secondaryBtnLabel: "Cancel",
};

CustomModal.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onHideModal: PropTypes.func,
  onHandleChangeModal: PropTypes.func,
  needPrimaryBtn: PropTypes.bool,
  primaryBtnLabel: PropTypes.string,
  primaryBtnDisabled: PropTypes.bool,
  needSecondaryBtn: PropTypes.bool,
  secondaryBtnLabel: PropTypes.string,
  secondaryBtnDisabled: PropTypes.bool,
  primaryBtnTheme: PropTypes.oneOf(validThemes),
};

export default CustomModal;
