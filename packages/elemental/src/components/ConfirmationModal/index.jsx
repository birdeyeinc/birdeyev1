import React from "react";
import PropTypes from "prop-types";
import styles from "./ConfirmationModal.module.scss";
import Modal from "atoms/Modal";
import Button from "atoms/Button";

const OriginalModal = (props) => {
  const {
    onCancel,
    cancelButtonLabel,
    onConfirm,
    confirmButtonLabel,
    customCTAClassName,
    customWidth,
    title,
    description,
    show,
    children,
    disableConfirmButton,
    onCloseModal,
    confirmButtonTheme,
    cancelButtonTheme,
  } = props;
  let custWidth = customWidth ? customWidth : 400;
  return (
    <Modal
      dialogOptions={{
        isOpen: show,
        title,
        onCloseModal: onCloseModal || onCancel,
        showCloseIcon: true,
        dialogStyles: {
          content: {
            width: custWidth,
          },
        },
      }}
    >
      <div className={`padding-30 el-confirmation-modal`}>
        <h2 className={styles["tag-modal-title"]}>{title}</h2>
        {description && typeof description === "string" ? (
          <p
            className={styles["modal-subtitle"]}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p>{description}</p>
        )}
        {children}
        <div className={`${customCTAClassName || ""} ${styles["btnWrapper"]}`}>
          <Button
            type={cancelButtonTheme}
            role={"button"}
            onClick={onCancel}
            label={cancelButtonLabel}
          />
          <Button
            type={confirmButtonTheme}
            role={"button"}
            onClick={onConfirm}
            label={confirmButtonLabel}
            disabled={disableConfirmButton}
          />
        </div>
      </div>
    </Modal>
  );
};

const StandardModal = (props) => {
  const {
    onCancel,
    cancelButtonLabel,
    onConfirm,
    confirmButtonLabel,
    customCTAClassName,
    customWidth,
    title,
    description,
    show,
    children,
    disableConfirmButton,
    onCloseModal,
    confirmButtonTheme,
    cancelButtonTheme,
  } = props;
  let custWidth = customWidth ? customWidth : 400;
  return (
    <Modal
      dialogOptions={{
        isOpen: show,
        title,
        onCloseModal: onCloseModal || onCancel,
        showCloseIcon: false,
        dialogStyles: {
          content: {
            width: custWidth,
            padding: "0px",
          },
        },
      }}
    >
      <div className={`${styles["standard-modal"]} el-confirmation-modal`}>
        <div className={`${styles["header"]}`}>
          <h2 className={`${styles["title"]}`}>{title}</h2>
          <i
            onClick={onCloseModal || onCancel}
            id="icon-reset"
            data-testid="el-test-modal-close-icon"
            className={`icon_phoenix-enclose ${styles["close-icon"]}`}
          ></i>
        </div>
        <div className={styles["body"]}>
          {description && typeof description === "string" ? (
            <p
              className={styles["description"]}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p>{description}</p>
          )}
          {children}
        </div>
        {onConfirm || onCancel ? (
          <div className={`${styles["footer"]} ${customCTAClassName || ""}`}>
            <Button
              type={cancelButtonTheme}
              role={"button"}
              onClick={onCancel}
              label={cancelButtonLabel}
            />
            <Button
              type={confirmButtonTheme}
              role={"button"}
              onClick={onConfirm}
              label={confirmButtonLabel}
              disabled={disableConfirmButton}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

const ConfirmationModal = ({ type = "original", ...otherProps }) => {
  return type == "original" ? (
    <OriginalModal {...otherProps} />
  ) : (
    <StandardModal {...otherProps} />
  );
};

ConfirmationModal.defaultProps = {
  cancelButtonLabel: "Cancel",
  confirmButtonLabel: "Confirm",
  title: "Do you want to proceed?",
  description: "",
  disableConfirmButton: false,
  cancelButtonTheme: "link",
  confirmButtonTheme: "primary",
};

ConfirmationModal.propTypes = {
  type: PropTypes.oneOf(["original", "standard"]),
  onCancel: PropTypes.func,
  cancelButtonLabel: PropTypes.string,
  cancelButtonTheme: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmButtonLabel: PropTypes.string,
  confirmButtonTheme: PropTypes.string,
  customCTAClassName: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  show: PropTypes.bool,
  children: PropTypes.node,
  customWidth: PropTypes.number,
  disableConfirmButton: PropTypes.bool,
  onCloseModal: PropTypes.func,
};

export default ConfirmationModal;
