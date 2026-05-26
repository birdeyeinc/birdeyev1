import PropTypes from "prop-types";
import AiLogo from "assets/AI_Icon.svg";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import moment from "moment";
import styles from "./AiBestTimeToPost.module.scss";

const AiBestTimeToPost = (props) => {
    const { datePublish, dispatch, updateTimeObject, isInDatePicker, hideAILogo = false, descriptText = null, socialChannels = [], onMount = () => {}, permissions, push } = props;

    useEffect(() => {
        onMount && onMount();

        return () => {
            onMount && onMount(true);
        };
    }, []);

    const convertTimestampToLocalTimeString = (timestamp) => {
        const timeString = moment(timestamp).format("hh:mm A");
        return timeString;
    };

    const localTimeString = convertTimestampToLocalTimeString(datePublish);

    const createPost = () => {
        if (window?.BE?.business.betaProductFeatures?.customRole ? !permissions?.readWritePermission : false) return;
        if (isEmpty(socialChannels) || socialChannels?.length > 1) {
            dispatch(push(`/dashboard/social/publish/createpost?startDate=${datePublish}&&frmCalendarBTTP=calendarBTTP`));
        } else {
            const channel = socialChannels?.[0];
            dispatch(push(`/dashboard/social/publish/createpost?startDate=${datePublish}&frmBTTP=bestTimeToPost&isSingleChannelCalendar=true&bttpChannels=${channel}`));
        }
    };

    const handleClick = () => {
        updateTimeObject(localTimeString);
    };

    return (
        <div className={styles["ai-best-time"]} onClick={isInDatePicker ? handleClick : createPost}>
            {!hideAILogo && <img src={AiLogo} alt="AI Logo" />}
            {descriptText ? <strong>{localTimeString}</strong> : <span>{localTimeString}</span>}
            {descriptText && <span>{descriptText}</span>}
        </div>
    );
};

AiBestTimeToPost.propTypes = {
    datePublish: PropTypes.number.isRequired,
    dispatch: PropTypes.func,
    updateTimeObject: PropTypes.func,
    isInDatePicker: PropTypes.bool,
    hideAILogo: PropTypes.bool,
    descriptText: PropTypes.string,
    socialChannels: PropTypes.array,
    onMount: PropTypes.func,
    permissions: PropTypes.object,
    business: PropTypes.object,
    push: PropTypes.func
};

export default AiBestTimeToPost;
