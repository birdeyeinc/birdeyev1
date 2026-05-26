import React from "react";
import SingleSelect from "atoms/SingleSelect";
import SearchFilter from "atoms/SearchFilter";
import Styles from "./FieldDrivenSearch.module.scss";

interface FieldOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface FieldDrivenSearchValue {
  field: string;
  search: string;
}

interface FieldDrivenSearchProps {
  fieldOptions: FieldOption[];
  selectedField?: string;
  searchStr?: string;
  onChange?: (value: FieldDrivenSearchValue) => void;
  onFieldChange?: (option: FieldOption) => void;
  onSearchChange?: (value: string) => void;
  className?: string;
  fieldWidth?: number;
  dropdownWidth?: number;
  singleSelectProps?: Record<string, unknown>;
  searchFilterProps?: Record<string, unknown>;
}

const FieldDrivenSearch: React.FC<FieldDrivenSearchProps> = ({
  fieldOptions,
  selectedField = "",
  searchStr = "",
  onChange,
  onFieldChange,
  onSearchChange,
  className = "",
  fieldWidth = 120,
  dropdownWidth = 200,
  singleSelectProps = {},
  searchFilterProps = {}
}) => {
  const handleFieldChange = (option: FieldOption) => {
    onFieldChange?.(option);
    onChange?.({
      field: option.value,
      search: searchStr
    });
  };

  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
    onChange?.({
      field: selectedField,
      search: value
    });
  };

  return (
    <div className={`${Styles["field-driven-search"]} ${className || ""}`}>
      <div
        className={Styles["field-select"]}
        style={{
          ...(fieldWidth ? { minWidth: fieldWidth, width: fieldWidth } : {}),
          "--dropdown-width": dropdownWidth ? `${dropdownWidth}px` : "200px"
        } as React.CSSProperties}
      >
        <SingleSelect
          options={fieldOptions}
          selected={selectedField}
          onChange={handleFieldChange}
          size="medium"
          customClass={Styles["field-select-dropdown"]}
          displayLabel="Search by"
          {...singleSelectProps}
        />
      </div>
      <div className={Styles["search-input"]}>
        <SearchFilter
          searchStr={searchStr}
          onInputValueChange={handleSearchChange}
          {...searchFilterProps}
        />
      </div>
    </div>
  );
};

export type { FieldDrivenSearchProps, FieldOption, FieldDrivenSearchValue };
export default FieldDrivenSearch;