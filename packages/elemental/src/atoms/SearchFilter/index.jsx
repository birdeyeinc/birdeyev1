import React from "react";
import PropTypes from "prop-types";
import Styles from "./SearchFilter.module.scss";
import Tooltip from "atoms/Tooltip";
import AlertImg from "assets/images/error.svg";
import { isEqual } from "lodash";
import onClickOutside from "react-onclickoutside";
import { getEncodedStyleClass } from "utils/index";

let counter = 0;

class SearchFilter extends React.Component {
  constructor(props) {
    super(props);
    this.searchId = "search-" + ++counter;
    this.labelText = "new-search" + ++counter;
    this.debounceTimeout = null;
    this.state = {
      searchStr: props.searchStr,
      focused: false,
    };
  }

  static propTypes = {
    resetSearch: PropTypes.bool,
    resetSearchVal: PropTypes.bool,
    inputMode: PropTypes.bool,
    placeholder: PropTypes.string,
    onCrossClickAction: PropTypes.func,
    onInputValueChange: PropTypes.func,
    customStyle: PropTypes.object,
    debounceDelay: PropTypes.number,
    searchStr: PropTypes.string,
    customClass: PropTypes.string,
    searchTooltipText: PropTypes.string,
    customTooltipCls: PropTypes.string,
    hideSearchIcon: PropTypes.bool,
    hideGlassIcon: PropTypes.bool,
    autoFocus: PropTypes.bool,
    disableAutoFocusOnUpdate: PropTypes.bool,
    disableAutoFocusOnMount: PropTypes.bool,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    id: PropTypes.string,
    label: PropTypes.string,
    xLargeHeight: PropTypes.bool,
    showCloseIconForEmptyValue: PropTypes.bool,
    displayError: PropTypes.bool,
    errorMessage: PropTypes.string,
    maxLength: PropTypes.number,
    multipleSearch: PropTypes.bool,
    getSearchKeywords: PropTypes.func,
    showErrorOutside: PropTypes.bool,
    showLoadingInput: PropTypes.bool,
    onClickOutside: PropTypes.func,
    isAeroDesign: PropTypes.bool,
  };

  onChangeCallBack = (value) => {
    const { multipleSearch, getSearchKeywords } = this.props;
    if (multipleSearch) {
      this.setState({
        searchStr: value,
      });
      getSearchKeywords(value);
    } else {
      this.setState(
        {
          searchStr: value,
        },
        () => {
          this.debounceTimeout && clearTimeout(this.debounceTimeout);
          this.debounceTimeout = setTimeout(() => {
            this.debounceTimeout = null;
            this.props.onInputValueChange.call(null, value);
          }, this.props.debounceDelay || 0);
        }
      );
    }
  };

  onCrossClickCallBack = () => {
    const { showCloseIconForEmptyValue, multipleSearch, getSearchKeywords } =
      this.props;
    if (this.state.searchStr || showCloseIconForEmptyValue) {
      const value = "";
      this.setState(
        {
          searchStr: value,
        },
        this.props.onCrossClickAction.bind(null, value)
      );
      if (multipleSearch) {
        getSearchKeywords(value);
      }
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    //Reset filter functionality only
    if (
      nextProps.resetSearch &&
      nextProps.resetSearch !== this.props.resetSearch
    ) {
      this.setState({
        searchStr: "",
      });
    } else if (
      nextProps.searchStr &&
      nextProps.resetSearchVal &&
      nextProps.searchStr !== this.props.searchStr
    ) {
      this.setState({
        searchStr: nextProps.searchStr,
      });
    }
    //BIRD-46006:Reset of Searching in Sentiment score by location when change in filters
    if (!isEqual(this.props.searchStr, nextProps.searchStr)) {
      this.setState({
        searchStr: nextProps.searchStr,
      });
    }
  }

  componentDidUpdate() {
    if (
      this.props.autoFocus &&
      !this.props.disableAutoFocusOnUpdate &&
      this.state.focused
    ) {
      this.searchInput && this.searchInput.focus();
    }
  }

  componentDidMount() {
    if (
      this.props.autoFocus &&
      !this.props.disableAutoFocusOnMount &&
      this.state.focused
    ) {
      this.searchInput && this.searchInput.focus();
    }
  }

  getSearchId = () => {
    const { id } = this.props;

    return id || this.searchId;
  };

  getLabel = () => {
    const { label } = this.props;
    return label || this.labelText;
  };

  onFocus = () => {
    const { onFocus } = this.props;
    this.setState({ focused: true });
    onFocus && onFocus();
  };

  onBlur = () => {
    const { onBlur } = this.props;
    this.setState({ focused: false });
    onBlur && onBlur();
  };

  onKeyDown = (e) => {
    const { onKeyDown } = this.props;
    if (e.key === "Enter" && onKeyDown) {
      this.setState({ focused: false });
      onKeyDown && onKeyDown();
    }
  };

  handleClickOutside() {
    const { onClickOutside } = this.props;

    onClickOutside && onClickOutside();
  }

  render() {
    const {
      customStyle,
      placeholder,
      searchTooltipText,
      customClass,
      customTooltipCls,
      hideSearchIcon,
      inputMode,
      autoFocus,
      showCloseIconForEmptyValue,
      hideGlassIcon,
      xLargeHeight,
      displayError,
      errorMessage,
      maxLength,
      showErrorOutside,
      showLoadingInput,
      isAeroDesign,
    } = this.props;
    const { onBlur, onFocus, onKeyDown } = this;
    const iconClass = Styles.icons;
    const containerEncodedClass = getEncodedStyleClass(
      `search-filter ${hideGlassIcon ? "hide-icon" : ""} ${
        customStyle ? customStyle : ""
      } ${inputMode ? "search-mode" : ""}  ${
        xLargeHeight ? "x-large-height" : ""
      }`,
      Styles
    );
    return (
      <div
        data-testid="el-test-searchfilter"
        className={`el-searchfilter ${customClass ? customClass : ""} ${
          displayError && showErrorOutside ? "invalid-error" : ""
        } ${showLoadingInput ? "loader-visible" : ""} ${containerEncodedClass}`}
      >
        <input
          type="text"
          id={this.getSearchId()}
          data-testid="el-test-searchfilter-input"
          name={this.getLabel()}
          placeholder={placeholder || "Search"}
          onChange={(e) => {
            this.onChangeCallBack(e.target.value);
          }}
          value={this.state.searchStr || ""}
          ref={(input) => {
            this.searchInput = input;
          }}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoComplete="off"
          aria-label=""
          spellCheck={false}
          {...(maxLength ? { maxLength } : {})}
          className={getEncodedStyleClass(
            `${displayError ? "error-class" : ""} ${
              isAeroDesign ? "ds-button-secondary" : ""
            }`,
            Styles
          )}
        />
        {!hideGlassIcon && (
          <span className={`icons ${Styles["search-glass-icon"]}  icon_phoenix-new-search-icon ${iconClass}`} />
        )}
        {!hideSearchIcon && (
          <span
            onClick={this.onCrossClickCallBack}
            data-testid="el-test-searchfilter-close"
            className={`${Styles["close-icon"]} ${
              this.state.searchStr || showCloseIconForEmptyValue
                ? "icons icon_phoenix-reset phoenix-icon"
                : ""
            } ${iconClass}`}
          />
        )}
        {searchTooltipText && this.state.searchStr === "" && (
          <span className={`${customTooltipCls} ${Styles["tooltipText"]}`}>
            {searchTooltipText}
          </span>
        )}
        {displayError && !showErrorOutside && (
          <span className={Styles["alert-img"]}>
            <Tooltip hideOnScroll text={errorMessage} position="bottom">
              <img src={AlertImg} alt="error" />
            </Tooltip>
          </span>
        )}
        {displayError && showErrorOutside && (
          <ul className="validation-errors">
            <li className="error-msge">{errorMessage}</li>
          </ul>
        )}
      </div>
    );
  }
}

export default onClickOutside(SearchFilter);
