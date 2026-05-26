import React, { useState, useEffect } from "react";
import SearchFilter from "atoms/SearchFilter";
import style from "./MultiLevelDropdownSelector.module.scss"
import { isEmpty } from "lodash";

type FilterItem = {
  value: string;
  filterKey: string;
  label?:string;
  parentAliasKey?: string;
  hasMoreOptions?: boolean;
};

interface FilterListProps {
  listOptions: FilterItem[];
  selectedValue?: string;
  handleFilterWithMoreOptions: (val: FilterItem) => void;
  noDataScreen:any;
  hideSearch?: boolean;
}

const FilterOptionsList: React.FC<FilterListProps> = ({
  listOptions,
  selectedValue = "",
  handleFilterWithMoreOptions,
  noDataScreen,
  hideSearch = false
}) => {
  const [search, setSearch] = useState("");
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<FilterItem[]>(listOptions);

  useEffect(()=>{
    const options = listOptions.filter((item) => {
      const labelText = item.label?.toLowerCase() || "";
      return labelText.includes(search.toLowerCase());
    });
    setFilteredOptions(options)
  },[search])

  useEffect(() =>{
    setSearch("");
    setFilteredOptions(listOptions);
  },[listOptions]);


  return (
    <div className={style["el-filter-options-list"]}>
      {!hideSearch && <SearchFilter
        placeholder={'Search...'}
        onCrossClickAction={() => setSearch("")}
        onInputValueChange={(value: string) => setSearch(value)}
        debounceDelay={0}
        customClass={""}
        searchStr={search}
        renderSearchIconOnLeft
        disableResetIcon
      />}
<div className={style["el-sub-list-options"]}>
        {isEmpty(filteredOptions || []) ?    
         <div>{noDataScreen}</div>
        :filteredOptions.length !== 0 && filteredOptions
          ?.map((item) => {
            const selected = item.label;
            const isSelected = selectedValue === selected;
            const isHovered = hoveredValue === selected;
            let itemClass = style["el-list-item"];

            if (isSelected) itemClass += ` ${style.selected}`;
            if (isHovered) itemClass += ` ${style.hovered}`;

            return (
              <div className={itemClass}
                key={item.value}
                onClick={() => handleFilterWithMoreOptions(item)}
                onMouseEnter={() => setHoveredValue(item.value)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                {item?.label}
                {item.hasMoreOptions &&  <i className="icon_phoenix-cheveron_open" />}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FilterOptionsList;
