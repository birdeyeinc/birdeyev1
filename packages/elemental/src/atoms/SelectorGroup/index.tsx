import React, { useState, useEffect } from "react";
import styles from "./SelectorGroup.module.scss";
import { numberWithCommas } from "utils/index";
import wordPositiveIcon from "assets/images/word-positive-icon.svg";
import wordNeutralIcon from "assets/images/word-neutral-icon.svg";
import wordNegativeIcon from "assets/images/word-negative-icon.svg";

export type SelectorOption = {
    key: string;
    label: string;
    count: number;
    icon?: React.ReactNode;
    disabled?: boolean;
};

type SelectorGroupProps = {
    options?: SelectorOption[];
    initialSelectedKey?: string;
    onChange?: (key: string) => void;
};

const defaultOptions: SelectorOption[] = [
    { label: "All", key: "all", count: 0 },
    { label: "", icon: wordPositiveIcon, key: "pos", count: 0 },
    { label: "", icon: wordNeutralIcon, key: "neu", count: 0 },
    { label: "", icon: wordNegativeIcon, key: "neg", count: 0 }
];

const SelectorGroup: React.FC<SelectorGroupProps> = ({
    options = defaultOptions,
    initialSelectedKey,
    onChange,
}) => {
    const [selectedKey, setSelectedKey] = useState<string>(
        initialSelectedKey ?? options[0]?.key ?? ""
    );

    useEffect(() => {
        if (initialSelectedKey !== undefined) {
            setSelectedKey(initialSelectedKey);
        }
    }, [initialSelectedKey]);

    const handleClick = (key: string) => {
        setSelectedKey(key);
        if (onChange) onChange(key);
    };

    return (
        <div className={styles.selectorGroup}>
            {options.map((opt) => (
                <button
                    key={opt.key}
                    className={`${styles.selector} ${selectedKey === opt.key ? styles.selected : ""} ${opt.disabled ? styles.disabled : ""}`}
                    onClick={() => handleClick(opt.key)}
                    type="button"
                >
                    <span className={styles.label}>
                        {opt.icon && (typeof opt.icon === 'string' ? <img src={opt.icon} /> : opt.icon)}
                        {opt.label}
                    </span>
                    <span className={styles.count}>{numberWithCommas(opt.count) || 0}</span>
                </button>
            ))}
        </div>
    );
};

export default SelectorGroup;
