/* eslint-disable */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Styles from "./index.module.scss";
import { debounce } from "lodash";
import LoaderBox from "atoms/LoaderBox";
import Tooltip from "atoms/Tooltip";
import PropTypes from "prop-types";

const getStyle = (classStr) => {
    return classStr
        .split(/[\s\n]+/)
        .map(singleClass => {
            if (!singleClass) return "";
            let encodedClass = Styles[singleClass] ? Styles[singleClass] : "";
            return singleClass + " " + encodedClass;
        })
        .filter(Boolean)
        .join(" ");
}

class Search extends Component {
    constructor(props) {
        super(props);
        const { getItemsAsync, delay } = this.props;

        this.state = {
            menuItems: [],
            selectedItems: [],
            searchValue: "",
            menuVisible: false,
            preSelected: []
        };

        if (getItemsAsync) {
            this.getItemsAsync = delay ? debounce(this.triggerGetItemsAsync, delay) : this.triggerGetItemsAsync;
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        const { initialSelected, focus, preSelectedItem } = this.props;
        if (initialSelected instanceof Array) {
            this.setSelected(initialSelected);
        } else {
            this.addSelected(initialSelected);
        }
        if (focus) {
            this.focusInput();
        }
        if(preSelectedItem && preSelectedItem.length) {
            this.setState({
                preSelected: preSelectedItem
            })
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { focus, resetTextValue, searchableFieldValue, preSelectedItem } = newProps;
        this.setState({ menuItems: newProps.items });

        if (focus && newProps.items.length === 0) {
            this.focusInput();
        }

        if (resetTextValue && resetTextValue !== this.props.resetTextValue) {
            this.resetSearchValue(true);
        }

        if(this.props.searchableFieldValue && searchableFieldValue && (this.props.searchableFieldValue.length !== searchableFieldValue.length)) {
            if ( this.props.fromContact ) {
            ReactDOM.findDOMNode(this.refs.searchInput).value = "";
            }
            this.setState({
                selectedItems: searchableFieldValue
            })
        }
        if(this.props.preSelectedItem && preSelectedItem && (this.props.preSelectedItem.length !==  preSelectedItem.length)) {
            this.setState({
                preSelected: preSelectedItem
            })
        }
    }

    SearchItemInArrayObjects(items, input, searchKey) {
        if(!input.length) return [];
        let reg = new RegExp(input.split("").join("\\w*").replace(/\W/, ""), "i");
        return items.filter((item) => {
            if (reg.test(item[searchKey])) {
                return item;
            }
        });
    }

    selectMenuItem(item) {
        const { multiple, clearText, customSearchHolder } = this.props;
        multiple ? this.addSelected(item) : this.setSelected([item]);
        if (clearText && !customSearchHolder) {
            ReactDOM.findDOMNode(this.refs.searchInput).value = "";
        }
        else if (customSearchHolder) {
            ReactDOM.findDOMNode(this.refs.searchInput).value = item && item.value;
        }
        this.hideMenu();
    }

    showMenu() {
        this.setState({ menuVisible: true });
    }

    hideMenu() {
        this.setState({ menuVisible: false });
        this.resetPlaceholder();
    }

    triggerItemsChanged(selItems) {
        const items = selItems || this.state.selectedItems;
        if (this.props.onItemsChanged !== undefined) {
            this.props.onItemsChanged(items);
        }
    }

    triggerKeyChange(searchValue) {
        if (this.props.onKeyChange !== undefined) {
            this.props.onKeyChange(searchValue);
        }
    }

    triggerGetItemsAsync(searchValue) {
        if (this.props.getItemsAsync !== undefined) {
            this.props.getItemsAsync(searchValue, () => {
                this.updateSearchValue(searchValue);
            });
        }
        this.forceUpdate();
    };

    setSelected(selected) {
        this.setState({ selectedItems: selected }, () => {
            this.triggerItemsChanged();
        });
    }

    addSelected(selected) {
        let items = [...this.state.selectedItems, selected];
        // this.setState({ selectedItems: items }, () => {
        //     this.triggerItemsChanged();
        // });
        this.setState({
            selectedItems: [...this.state.selectedItems, selected]
        });
        this.triggerItemsChanged(items);

    }

    removeSelected(itemId) {
        let items = this.state.selectedItems;
        let itemsUpdated = items.filter((i) => {
            return i.id != itemId;
        });
        this.setState({ selectedItems: itemsUpdated }, () => {
            this.triggerItemsChanged();
        });
    }

    updateSearchValue(value) {
        const { items } = this.props;
        this.setState({ searchValue: value }, () => {
            let menuItems = this.SearchItemInArrayObjects(items, this.state.searchValue, this.props.searchKey);
            this.setMenuItems(menuItems);
        });
    }

    showAllMenuItems() {
        const { items } = this.props;
        this.setState({ searchValue: "" });
        let menuItems = this.SearchItemInArrayObjects(items, "", this.props.searchKey);
        this.setMenuItems(menuItems);
    }

    setMenuItems(menuItems) {
        const { getItemsAsync, items } = this.props;
        this.setState({ menuItems });
        if (menuItems.length || getItemsAsync != undefined || !items.length) {
            this.showMenu();
        } else {
            this.hideMenu();
        }
    }

    itemSelected(itemId) {
        const { selectedItems, preSelected } = this.state;
        let item = selectedItems.find((s) => {
            return s.id === itemId;
        }) || preSelected.find((s) => {
            return s.id === itemId;
        });
        return (item != undefined) ? true : false;
    }

    focusInput() {
        this.showAllMenuItems();
        //ReactDOM.findDOMNode(this.refs.searchInput).placeholder = ''
        // ReactDOM.findDOMNode(this.refs.searchInput).value = "";
        clearTimeout(this.blurTimeout);
        this.blurTimeout = setTimeout(() => {
            ReactDOM.findDOMNode(this.refs.searchInput) && ReactDOM.findDOMNode(this.refs.searchInput).focus();
        }, 200);
    }


    blurInput() {
        const { blurCallback, clearText, customSearchHolder } = this.props;
        clearTimeout(this.blurTimeout);
        this.blurTimeout = setTimeout(() => {
            ReactDOM.findDOMNode(this.refs.searchInput) && ReactDOM.findDOMNode(this.refs.searchInput).blur();
            this.hideMenu();
            blurCallback && ReactDOM.findDOMNode(this.refs.searchInput) && blurCallback(ReactDOM.findDOMNode(this.refs.searchInput).value);
            if (clearText && !customSearchHolder) {
                ReactDOM.findDOMNode(this.refs.searchInput) ? ReactDOM.findDOMNode(this.refs.searchInput).value = "" : null;
            }
        }, 200);
    }

    resetPlaceholder() {
        let placeholder = ReactDOM.findDOMNode(this.refs.placeholder);
        placeholder = this.props.placeholder;
    }

    handleRemove(e) {
        e.preventDefault();
        e.stopPropagation();
        this.removeSelected(e.target.dataset.id);
    }

    handleFocus(e) {
        this.focusInput();
        if (this.props.handleFocus) {
            this.props.handleFocus(true);
        }
    }

    handleBlur(e) {
        if (this.props.handleFocus) {
            this.props.handleFocus(false);
        }
        this.blurInput();
    }

    handleClick(e) {
        e.stopPropagation();
        this.focusInput();
        const { getItemsAsync, customSearchHolder, searchFieldErr, resetErrorState, searchFieldErrMessage } = this.props;
        if (customSearchHolder && (searchFieldErr || searchFieldErrMessage) && this.refs.searchInput) {
            getItemsAsync(this.refs.searchInput.value);
            resetErrorState()
            //this.blurCallback()
        }
    }

    handleItemClick(e) {
        this.focusInput();
    }

    handleSelect(e) {
        const { isItemIdInteger, handleSelectCb } = this.props;
        
        let element = e.currentTarget.children[0];
        let value = element.dataset.value || element.innerHTML;
        let item = { id: isItemIdInteger ? parseInt(element.dataset.id) : element.dataset.id, key: element.dataset.key, value: value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") };
        this.selectMenuItem(item);
        handleSelectCb && handleSelectCb(item);
    }

    handleKeyChange(e) {
        const { getItemsAsync } = this.props;
        let value = this.refs.searchInput.value;
        this.triggerKeyChange(value);
        if (getItemsAsync != undefined) {
            this.getItemsAsync(value);
        } else {
            this.updateSearchValue(value);
        }
    }

    handleKeyDown(e) {
        const { handleKeyDown } = this.props;
        let value = this.refs.searchInput.value;
        handleKeyDown && handleKeyDown(e, value);
    }

    renderMenuItems() {
        const { menuItems } = this.state;
        const { NotFoundPlaceholder, items, NoItemsPlaceHolder,showLoader, customSearchHolder, disableHoverText, ignoreSelection, showLoaderHard, showAlreadySelectedTags, showNoDataFound } = this.props;
        if (!menuItems.length && this.refs.searchInput && this.refs.searchInput.value === "" && NoItemsPlaceHolder) {
            return (
                <li className={getStyle('autocomplete__item autocomplete__item--disabled')}>
                    <span data-id={0}>{NoItemsPlaceHolder}</span>
                </li>
            );
        }

        if (showLoaderHard) {
            return (
                // <li className='autocomplete__item autocomplete__item--disabled'>
                    // <span data-id={0}>
                        this.showLoadingState()
                    // </span>
                // </li>
            );
        }

        if (!menuItems.length && this.refs.searchInput && (this.refs.searchInput.value != "") && (NotFoundPlaceholder || customSearchHolder)) {
            if (showLoader) {
                return (
                    // <li className='autocomplete__item autocomplete__item--disabled'>
                        // <span data-id={0}>
                            this.showLoadingState()
                        // </span>
                    // </li>
                );
            } else {
                return customSearchHolder ? <span data-id={0}>{customSearchHolder}</span> : (
                     <li className={getStyle('autocomplete__item autocomplete__item--disabled')}>
                        <span data-id={0} onClick={this.handleNotFoundPlaceholderClick.bind(this)}>
                            {NotFoundPlaceholder}
                        </span>
                     </li>
                );

            }
        }

        let renderableItem = menuItems.length ?  menuItems : items;

        let renderItems = renderableItem.map((item, i) => {
            const {renderCustomSuggestionsView, customModuleName} = this.props;
            const enableEmailView = customModuleName === 'AddEditApprovals' || customModuleName === 'ConfigureSetApproval';

            if(renderCustomSuggestionsView){
                const itemName = renderCustomSuggestionsView(item);
                return (
                    enableEmailView ? <li key={i} className={getStyle('autocomplete__item')} onMouseDown={this.handleDisabledMouseDown} onClick={this.handleSelect}>
                        {itemName}
                    </li> : 
                    <li key={i} className={getStyle('autocomplete__item')} onClick={this.handleSelect}>
                        <span key={i} data-id={item.id} data-key={item.key} data-value={item.pristineValue}>{itemName}</span>
                    </li>
                );
            }else {
                if (ignoreSelection ? item.disabled : this.itemSelected(item.id)) {
                    if(showAlreadySelectedTags){
                        return (
                            <li key={i} className={getStyle('autocomplete__item autocomplete__item--disabled')} onMouseDown={this.handleDisabledMouseDown}>
                                {disableHoverText ?
                                    <Tooltip text={disableHoverText} customContainerClassName={getStyle('search-list-tooltip-container')}>
                                        <span key={i} data-id={item.id} data-key={item.key}>{item.value}</span>
                                    </Tooltip> :
                                    <span key={i} data-id={item.id} data-key={item.key}>{item.value}</span>}
                            </li>
                        )
                    } else return null;
                } else {
                    return (
                        <li key={i} className={getStyle('autocomplete__item')} onClick={this.handleSelect}>
                            <span key={i} data-id={item.id} data-key={item.key}>{item.value}</span>
                        </li>
                    );
                }
            }
        });
        return showNoDataFound && showNoDataFound() ? (
            <div>
                 <li className={getStyle('autocomplete__item autocomplete__item--disabled')}>
                    {showNoDataFound()}
                </li>
                {renderItems}
            </div>
        ) : renderItems;
    }

    handleDisabledMouseDown = (event) => {
        /** mousedown event handled instead of click because blur is called before it and the menu is closed,
        * we need list event handler to be called before so that we can stop all other event handlers to be called */
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    renderSelectedItems() {
        const { selectedItems } = this.state;
        const { multiple, placeholder } = this.props;
        if (!selectedItems.length && multiple) return;

        if (!selectedItems.length && !multiple) {
            return (
                <li data-testid="el-autocomplete-placeholder-item" className={getStyle('autocomplete__item autocomplete__item--selected autocomplete__item__dropdown')}
                    onClick={this.handleItemClick.bind(this)}>
                    <span dangerouslySetInnerHTML={{ __html: placeholder }} />
                    <span className={getStyle('autocomplete__dropdown')} />
                </li>
            );
        }

        let items = selectedItems.map((item, i) => {
            let itemClass = getStyle('autocomplete__item autocomplete__item--selected autocomplete__item__dropdown');
            let dropDown = <span className={getStyle('autocomplete__dropdown')} />;
            let icon = (<span data-id={item.id} data-key={item.key} className={getStyle('autocomplete__close')}
                onClick={this.handleRemove.bind(this)} />);

            if (multiple) {
                dropDown = null;
                itemClass = getStyle('autocomplete__item autocomplete__item--selected');
            }

            return (
                <li key={i} className={itemClass} onClick={this.handleItemClick.bind(this)}>
                    <span data-id={item.id} data-key={item.key} dangerouslySetInnerHTML={{ __html: item.value }} />
                    {icon}
                    {dropDown}
                </li>
            );
        });
        return items;
    }
    resetSearchValue = (avoidFocus) => {
        // const { resetSearchFieldValue } = this.props;
        // resetSearchFieldValue();
        const { resetErrorState } = this.props;
        ReactDOM.findDOMNode(this.refs.searchInput).value = "";
        !avoidFocus && this.focusInput();
        resetErrorState()
    }
    showResetIcon () {
        const {customSearchHolder} = this.props;
        if (this.refs && this.refs.searchInput && this.refs.searchInput.value.length && customSearchHolder) {
            return (
                <span className={`${getStyle('icons')} icon_phoenix-reset`} onClick={this.resetSearchValue}></span>
            );
         }
    }

    renderInput() {
        const { maxSelected, multiple, customSearchHolder, searchFieldErr, searchFieldErrMessage, inputName, inputAutoComplete, autoComplete } = this.props;
        const { selectedItems } = this.state;
        let inputClass = getStyle("autocomplete__input");
        let inputProps = {};
        if (multiple && selectedItems.length >= maxSelected) {
            inputClass = getStyle("autocomplete__input autocomplete__input--hidden");
        }
        if((searchFieldErr || searchFieldErrMessage) && customSearchHolder) {
            inputClass = inputClass + " " + getStyle("invalid");
        }

        /** If the user wants to provide custom name, autocomplete feature for search */
        if (inputName) {
            inputProps.name = inputName;
        }

        if (this.focus) {
            inputClass = inputClass + " input_focus";
        }

        if (inputAutoComplete) {
            inputProps.autocomplete = inputAutoComplete;
        }

        return (
            <span className={getStyle("invite-wrap")}>
            <input type='text'
                className={inputClass}
                ref='searchInput'
                placeholder={this.props.placeholder}
                onClick={this.handleClick.bind(this)}
                onFocus={this.handleFocus.bind(this)}
                onBlur={this.handleBlur.bind(this)}
                onKeyUp={this.handleKeyChange.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
                autoComplete={autoComplete}
                {...inputProps}
                data-testid='tags-input'
            />
                {this.showResetIcon()}
            </span>
            );
    }

    showLoadingState () {
        const { sellerInfo } = this.props;
        return (<LoaderBox loaderBoxClass="small" customSizeClass="small" type="loader-birdeye" reseller={sellerInfo?.reseller || false}  message="" className="abs-loader"/>);
    }

    getMenuClass() {
        const { maxSelected, multiple } = this.props;
        const { menuVisible, selectedItems } = this.state;
        let menuClass = getStyle("autocomplete__menu autocomplete__menu--hidden");
        if (menuVisible && !multiple) {
            menuClass = getStyle("autocomplete__menu");
        }
        if (menuVisible && selectedItems.length < maxSelected) {
            menuClass = getStyle("autocomplete__menu");
        }
        return menuClass;
    }

    /** when hovertext/tooltip over last menu item, make overflow-y visible for the tooltip to show properly */
    isLastMenuItemDisabled() {
        const { disableHoverText } = this.props;
        const { menuItems } = this.state;
        const lastMenuItem = menuItems.length ? menuItems[menuItems.length - 1] : null;
        let isDisabled = false;

        if (disableHoverText && lastMenuItem) {
            isDisabled = lastMenuItem.disabled || this.itemSelected(lastMenuItem.id);
        }

        return isDisabled;
    }

    handleNotFoundPlaceholderClick() {
        ReactDOM.findDOMNode(this.refs.searchInput).value = "";
        this.hideMenu();
    }

    render() {
        const { multiple, customAutoCompleteClasses, showSuggestions, showLazyLoadLoader } = this.props;
        let menuClass = this.getMenuClass();
        const isLastMenuItemDisabled = this.isLastMenuItemDisabled();

        return (
            <div data-testid="el-test-search" className={`el-search ${getStyle("autocomplete")} ${customAutoCompleteClasses? customAutoCompleteClasses : "" }`}>

                <div data-testid="el-autocomplete-selected-items" className={getStyle('autocomplete__selected')}>
                    <ul className={`${getStyle('autocomplete__items')} custom-scroll`}>
                        {this.renderSelectedItems()}
                    </ul>
                </div>

                {multiple && this.renderInput()}

                <div className={getStyle('autocomplete__menu--wrap')}>
                    <div className={menuClass} ref='autocomplete'>
                        {!multiple && this.renderInput()}
                        {showSuggestions ?
                            <ul data-testid="el-autocomplete-items" className={getStyle('autocomplete__items') + (isLastMenuItemDisabled ? getStyle('overflow-visible') : '')}>
                                {this.renderMenuItems()}
                                {showLazyLoadLoader ? this.showLoadingState() : null}
                            </ul>: null
                        }
                    </div>
                </div>

            </div>
        );
    }
}

Search.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    initialSelected: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.object)
    ]),
    onItemsChanged: PropTypes.func,
    placeholder: PropTypes.string,
    NotFoundPlaceholder: PropTypes.string,
    maxSelected: PropTypes.number,
    multiple: PropTypes.bool,
    onKeyChange: PropTypes.func,
    getItemsAsync: PropTypes.func,
    searchKey: PropTypes.string,
    blurCallback: PropTypes.func,
    delay: PropTypes.number,
    focus: PropTypes.bool,
    handleKeyDown: PropTypes.func,
    clearText: PropTypes.bool,
    disableHoverText: PropTypes.string,
    inputAutoComplete: PropTypes.string,
    inputName: PropTypes.string,
    resetTextValue: PropTypes.bool,
    renderCustomSuggestionsView: PropTypes.func,
    isItemIdInteger: PropTypes.bool,
    searchableFieldValue: PropTypes.array,
    showSuggestions: PropTypes.bool,
    showAlreadySelectedTags: PropTypes.bool,
    preSelectedItem: PropTypes.array,
    handleSelectCb: PropTypes.func,
    handleFocus: PropTypes.func,
    showLazyLoadLoader: PropTypes.bool,
    showNoDataFound: PropTypes.func
}

Search.defaultProps = {
    initialSelected: [],
    placeholder: "— None",
    NotFoundPlaceholder: "",
    NoItemsPlaceHolder: "",
    maxSelected: 100,
    multiple: false,
    searchKey: "value",
    delay: undefined,
    showSuggestions: true,
    showAlreadySelectedTags: true,
    preSelectedItem: []
}

export default Search;
/* eslint-enable */
