import React from "react";
import Button from "atoms/Button";
import style from "../SplitDropdown.module.scss";

const ActionFooter: React.FC<{ onApply: () => void; onClear: () => void }> = ({ onApply, onClear }) => {
    return (
        <div className={style["action-footer"]} data-test-id="el-test-split-dropdown-action-footer">
            <Button onClick={onClear} theme="link" label="Clear" className="mr-5" data-test-id="el-test-split-dropdown-clear" />
            <Button onClick={onApply} label="Apply" data-test-id="el-test-split-dropdown-apply" />
        </div>
    );
};

export default ActionFooter;