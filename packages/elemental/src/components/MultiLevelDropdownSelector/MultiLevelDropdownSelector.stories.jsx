import React, { useState } from "react";
import Component from ".";

export default {
  title: "Component/MultiLevelDropdownSelector",
  component: Component,
  tags: ["autodocs"],
};

const navMultiSelectOptions = [
  {
    label: "00622",
    value: "1355327",
    businessKey: 172133591523666,
    valid: "valid",
  },
  {
    label: "00627",
    value: "1355316",
    businessKey: 172133590162872,
    valid: "valid",
  },
  {
    label: "110001",
    value: "1349909",
    businessKey: 172064179100564,
    valid: "valid",
  },
  {
    label: "110001",
    value: "1351052",
    businessKey: 172073234669878,
    valid: "valid",
  },
  {
    label: "110001",
    value: "1290657",
    businessKey: 170979922338192,
    valid: "valid",
  },
  {
    label: "110002",
    value: "1306981",
    businessKey: 171329322745057,
    valid: "valid",
  },
  {
    label: "110003",
    value: "1351070",
    businessKey: 172073469625653,
    valid: "valid",
  },
  {
    label: "110016",
    value: "1287303",
    businessKey: 170914767812857,
    valid: "valid",
  },
  {
    label: "110016",
    value: "1351073",
    businessKey: 172073484951475,
    valid: "valid",
  },
];

const navOptions = [
  {
    label: "Selected Locations",
    value: 1,
    aliasName: "Location",
    name: "Location",
    aliasNameMultiple: "Locations",
  },
  {
    label: "Selected Regions",
    value: "487",
    aliasName: "Region",
    name: "Region",
    aliasNameMultiple: "Regions",
  },
  {
    label: "Selected Divisions",
    value: "489",
    aliasName: "Division",
    name: "Division",
    aliasNameMultiple: "Divisions",
  },
  {
    label: "Selected Cities",
    value: "3860",
    aliasName: "City",
    name: "City",
    aliasNameMultiple: "Cities",
  },
];

export const Default = ({ ...args }) => {
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [selectedNavItem, setSelectedNavItem] = useState({
    id: 1,
    value: 1,
    name: "loc",
    aliasName: "Location",
    aliasNameMultiple: "Locations",
    label: "Selected locations",
  });

  return (
    <Component
      selectedNavMultiSelectItem={selectedItemsMap}
      selectedNavItem={selectedNavItem}
      navMultiSelectOptions={navMultiSelectOptions}
      navOptions={navOptions}
      closeOnOutsideClick
      title="1 Location"
      navOptionClickHandler={(item) => setSelectedNavItem(item)}
      navMultiSelectClickHandler={(option, event, type, optionList) => {
        if (type == "SELECTED_ALL") {
          setSelectedItemsMap(
            navMultiSelectOptions.reduce((acc, item) => {
              acc[item.value] = true;
              return acc;
            }, {})
          );
        } else if (type == "REMOVE_ALL") {
          setSelectedItemsMap({});
        } else {
          if (option.value in selectedItemsMap) {
            setSelectedItemsMap((p) => ({
              ...p,
              [option.value]: !selectedItemsMap[option.value],
            }));
          } else {
            setSelectedItemsMap((p) => ({ ...p, [option.value]: true }));
          }
        }
      }}
      showPrimaryCta
      showSecondaryCta
      secondaryCtaLabel="Advanced filter"
      primaryCtaLabel="Apply"
      primaryCtaClickCb={(response) => {
        console.log("apply", response)
      }}
      secondaryCtaAppliedCount={10}
      {...args}
    />
  );
};

export const WithPagination = ({ ...args }) => {
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [selectedNavItem, setSelectedNavItem] = useState({
    id: 1,
    value: 1,
    name: "loc",
    aliasName: "Location",
    aliasNameMultiple: "Locations",
    label: "Selected locations",
  });
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [navMultiSelectOptionsList, setNavMultiSelectOptionsList] = useState(navMultiSelectOptions);

  const loadMore = (page) => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const newPageCount = pageCount + 1;
    
    console.log("Loading more items... called times: ", newPageCount);
    
    // Simulate loading delay
    setTimeout(() => {
      setNavMultiSelectOptionsList(prevList => [...prevList, 
        {
          label: `Location ${newPageCount}-1`,
          value: `135532${newPageCount}1`,
          businessKey: 172133591523666 + newPageCount,
          valid: "valid",
        },
        {
          label: `Location ${newPageCount}-2`,
          value: `135532${newPageCount}2`,
          businessKey: 172133591523666 + newPageCount + 1,
          valid: "valid",
        }
      ]);
      
      setPageCount(newPageCount);
      setIsLoading(false);
      setHasMore(newPageCount < 5); // Stop after 5 pages
    }, 1000);
  };

  const loader = <div key="loader">Loading more items...</div>;
console.log("Story re-rendering every now and then")
  return (
    <Component
      selectedNavMultiSelectItem={selectedItemsMap}
      selectedNavItem={selectedNavItem}
      navMultiSelectOptions={navMultiSelectOptionsList}
      navOptions={navOptions}
      closeOnOutsideClick
      title="1 Location"
      navOptionClickHandler={(item) => setSelectedNavItem(item)}
      navMultiSelectClickHandler={(option, event, type, optionList) => {
        if (type == "SELECTED_ALL") {
          setSelectedItemsMap(
            navMultiSelectOptionsList.reduce((acc, item) => {
              acc[item.value] = true;
              return acc;
            }, {})
          );
        } else if (type == "REMOVE_ALL") {
          setSelectedItemsMap({});
        } else {
          if (option.value in selectedItemsMap) {
            setSelectedItemsMap((p) => ({
              ...p,
              [option.value]: !selectedItemsMap[option.value],
            }));
          } else {
            setSelectedItemsMap((p) => ({ ...p, [option.value]: true }));
          }
        }
      }}
      paginationConfig={{
        // enablePagination: true,
        // paginationNavOptions: [1], // Enable pagination only for Location (value: 1)
        hasMore: hasMore,
        loadMore: loadMore,
        loader: loader,
        useWindow: false,
        initialLoad: false,
        threshold: 250
      }}
      showPrimaryCta
      showSecondaryCta
      secondaryCtaLabel="Advanced filter"
      primaryCtaLabel="Apply"
      primaryCtaClickCb={(response) => {
        console.log("apply", response)
      }}
      secondaryCtaAppliedCount={10}
      {...args}
    />
  );
};
