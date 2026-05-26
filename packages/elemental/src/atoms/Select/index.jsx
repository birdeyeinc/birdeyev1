import React,{ createContext, useContext } from "react";
import PropTypes from "prop-types";
import useControlled from "hooks/useControlled";
import style from "./Select.module.scss";
import useClickOutside from "hooks/useClickOutside";

const SelectContext = createContext();

const Select = ({
  autoWidth = false,
  children,
  classes = {},
  defaultOpen = false,
  defaultValue,
  IconComponent = () => <i className="icon_phoenix-down-arrow" />,
  id,
  idKey,
  labelKey,
  multiple = false,
  onChange,
  onClose,
  onOpen,
  open: coontrolledOpen,
  renderValue,
  selectDisplayProps = {},
  value: controlledValue,
  variant = "outlined",
  placeHolder = "Select...",
  MenuElement = "ul",
  errorObj
}) => {
  const [open, setOpen] = useControlled(coontrolledOpen, defaultOpen);
  const [value, setValue] = useControlled(controlledValue, defaultValue);

  if (multiple && !Array.isArray(value))
    throw new Error(
      "The value prop should be an Array when using select component with multiple"
    );

  const handleClickOutside = (event) => {
    event.stopPropagation();
    setOpen(false);
    if (onClose) {
      onClose(event);
    }
  };

  const { ref } = useClickOutside(null, null, handleClickOutside);

  // useEffect(() => {

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [onClose]);

  const handleToggle = (event) => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen && onOpen) onOpen(event);
    if (!newOpen && onClose) onClose(event);
  };

  const getValueFromKey = (valueObj, key) => {
    if (valueObj === undefined) return valueObj;
    if (typeof valueObj == "string") return valueObj;
    if (typeof valueObj == "object" && !key)
      throw new Error(
        `If you are passing object as value then you should pass prop idKey for selection and labelKey for displayValue `
      );
    return key && valueObj ? valueObj[key] : valueObj;
  };

  const displayValue = (value) => {
    if (!Array.isArray(value) && typeof value !== "string")
      return getValueFromKey(value, labelKey);
    if (Array.isArray(value)) {
      return value.map((item) => getValueFromKey(item, labelKey)).join(", ");
    }
    return value;
  };

  const handleSelect = (event, childValue) => {
    let checked = true;
    if (multiple) {
      const newValue = [...value];
      const itemIndex = newValue.findIndex(
        (item) =>
          getValueFromKey(item, idKey) === getValueFromKey(childValue, idKey)
      );
      if (itemIndex === -1) {
        newValue.push(childValue);
        checked = true;
      } else {
        newValue.splice(itemIndex, 1);
        checked = false;
      }
      setValue(newValue);
      if (onChange) onChange(event, newValue, open, childValue, checked);
    } else {
      setValue(childValue);
      if (onChange) onChange(event, childValue, open, childValue, checked);
      setOpen(false);
    }
  };

  const handleRemove = (event, childValue)=>{
    let checked = false;
    if(multiple){
      const newValue = [...value];
      const itemIndex = newValue.findIndex(
        (item) =>
          getValueFromKey(item, idKey) === getValueFromKey(childValue, idKey)
      );
      if (itemIndex !== -1) {
        newValue.splice(itemIndex, 1);
        setValue(newValue);
        if (onChange) onChange(event, newValue, open, childValue, checked);
      }
    } else {
      setValue(null);
      if(onChange) onChange(event, null, open, childValue, checked);
      setOpen(false);
    }
  }

  const renderSelectedValue = () => {
    return renderValue ? renderValue(value) : displayValue(value);
  };

  return (
    <SelectContext.Provider value={{ handleSelect, handleRemove }}>
      <div
        className={`${classes.root ?? ""} ${style["select-container"]}`}
        id={id}
      >
        <div
          {...selectDisplayProps}
          className={`${classes.selectDisplay ?? ""} ${style.select} ${
            style[`select--${variant}`]
          } ${open ? style.open : ""} ${errorObj?.show ? style['select--error'] : ''}`}
          onClick={handleToggle}
          style={{ width: autoWidth ? "auto" : "100%" }}
        >
          {renderSelectedValue() || <span className={style.placeholder}>{placeHolder}</span>}
          <IconComponent />
        </div>
        {open && (
          <MenuElement
            className={`${classes.menu ?? ""} ${style.menu}`}
            style={{ width: autoWidth ? "auto" : "100%" }}
            ref={ref}
          >
            {children}
          </MenuElement>
        )}
        {( errorObj?.show && errorObj?.message) ? <p className={`${style['error-msg']} ${errorObj?.className || ""}`}>{errorObj.message}</p> : null}
      </div>
    </SelectContext.Provider>
  );
};

const SelectItem = ({
  children,
  value,
  selectItemClass = "",
  disabled = false,
}) => {
  const { handleSelect } = useContext(SelectContext);
  return (
    <li
      onClick={(e) => {
        if (!disabled) handleSelect(e, value);
      }}
      className={`${style["select-item"]} ${selectItemClass} ${
        disabled ? style.disabled : ""
      }`}
    >
      {children}
    </li>
  );
};

Select.propTypes = {
  /** If true, the select width will be auto-adjusted */
  autoWidth: PropTypes.bool,

  /** Child elements to be rendered inside the select */
  children: PropTypes.node,

  /** Custom classes for styling the select */
  classes: PropTypes.shape({
    /** Class applied to the root element */
    root: PropTypes.string,
    /** Class applied to the select display */
    selectDisplay: PropTypes.string,
    /** Class applied to the menu */
    menu: PropTypes.string,
  }),

  /** Controls whether the select opens by default */
  defaultOpen: PropTypes.bool,

  /** The default value of the select */
  defaultValue: PropTypes.any,

  /** Custom component for the select icon */
  IconComponent: PropTypes.elementType,

  /** Unique identifier for the select component */
  id: PropTypes.string,

  /** Key for the id of the options ( its only necessary when your value is object ) */
  idKey: PropTypes.string,

  /** Key for the label of the options ( its only necessary when your value is object ) */
  labelKey: PropTypes.string,

  /** If true, multiple values can be selected (Note: multiple is always controlled so we have to pass value prop as an array either empty or with some selected value) */
  multiple: PropTypes.bool,

  /** Callback function called when the selected value changes */
  onChange: PropTypes.func,

  /** Callback function called when the select closes */
  onClose: PropTypes.func,

  /** Callback function called when the select opens */
  onOpen: PropTypes.func,

  /** Controls whether the select is open */
  open: PropTypes.bool,

  /** Function to customize the rendering of the selected value */
  renderValue: PropTypes.func,

  /** Additional props to pass to the select display */
  selectDisplayProps: PropTypes.object,

  /** Current value of the select, can be a string or an array */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),

  /** The variant of the select, can be 'outlined', 'filled', or 'standard' */
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),

  /** Placeholder text for the select */
  placeHolder: PropTypes.string,

  /** errorObj for showing error */
  errorObj: PropTypes.shape({
    show: PropTypes.bool,
    messgae: PropTypes.string,
    className: PropTypes.string,
  })

};

// Define PropTypes for SelectItem component
SelectItem.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.any.isRequired,
};

export { Select, SelectItem, SelectContext };
