import React from 'react';
import styles from './logo.module.scss';
import { getEncodedStyleClass } from 'utils/index';
import { isEmpty } from 'lodash';

export default function AvatarLogo(props) {
    const {
        userName = "",
        showLastname = true,
        customStyleClassName = "set-avtaar"
    } = props;
    const getIconAvatarClass = (firstName, lastName) => {
        let className = "";
        const initials = `${firstName && firstName[0]}${lastName && lastName[0]}`;

        if (!isEmpty(initials)) {
            const initialModulus = (initials.charCodeAt(0) + (initials[1] ? initials.charCodeAt(1) : 0)) % 7;

            switch (initialModulus) {
                case 0:
                    className = "light-pink";
                    break;
                case 1:
                    className = "dark-blue";
                    break;
                case 2:
                    className = "light-orange";
                    break;
                case 3:
                    className = "light-green";
                    break;
                case 4:
                    className = "light-blue";
                    break;
                case 5:
                    className = "light-red";
                    break;
                case 6:
                    className = "dark-green";
                    break;

                default: className = "light-orange";
            }
        }

        return className;
    };

    const getFirstAndLastName = () => {
        const nameObj = { firstName: "", lastName: "" };
        if (userName) {
            const parts = userName.split(" ");
            if (parts.length > 1) {
                nameObj.firstName = parts[0];
                nameObj.lastName = parts[parts.length - 1];
            } else {
                nameObj.firstName = parts[0];
            }
        }
        return nameObj;
    };

    const { firstName, lastName } = getFirstAndLastName();
    return (
        <div className={`el-avatar-logo ${styles["set-intitals"]} ${getEncodedStyleClass(customStyleClassName, styles)} ${getIconAvatarClass(firstName, lastName)}`}>
            <span>{firstName && firstName[0].toUpperCase()}{(showLastname && lastName) && lastName[0].toUpperCase()}</span>
        </div>
    )
}