import Modal from "atoms/Modal";
import React from "react";
import TableContainer from "../Table";
import style from "./ReportTable.module.scss";

function ReportTableModal({ isOpen, onClose, reportConfig }) {
    return (
        <Modal
            dialogOptions={{
                isOpen,
                onCloseModal: onClose,
                shouldCloseOnOverlayClick: true,
                shouldCloseOnEsc: true,
                showCloseIcon: true,
                title: `Table View`,
            }}
            size="extraLarge"
        >
            <div className={style.modalContent}>
                <TableContainer reportConfig={reportConfig} />
            </div>
        </Modal>
    );
}

export default ReportTableModal;
