import React from "react";
import Component from ".";
import NoDataSimple from "components/NoData/simple";
import noDataImage from "assets/images/noDataImage.svg";

export default {
  title: "Component/ListWithCheckbox",
  component: Component,
  tags: ["autodocs"],
};

const Template = (args) => <Component {...args} />;

const getNoDataScreen = () => {
  return (
    <NoDataSimple
      imageUrl={noDataImage}
      title={`No Data found`}
      customClassName={"nodata"}
    />
  );
};

// Function to generate list of objects
const generateListObjects = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    businessKey: 172133591523666 + index,
    label: String(100 + index).padStart(5, '0'),
    valid: "valid",
    value: String(13553274 - index),
  }));
};

export const Default = Template.bind({});
Default.args = {
  searchPlaceholder: "Search location",
  showCheckboxBeforeText: true,
  noDataScreen: getNoDataScreen(),
  virtualizationProps: { isEnabled: false },
  list: generateListObjects(50), // Generate 50 items for non-virtualization demo
};


export const WithVirtualization = Template.bind({});
WithVirtualization.args = {
  searchPlaceholder: "Search location",
  showCheckboxBeforeText: true,
  noDataScreen: getNoDataScreen(),
  virtualizationProps: { isEnabled: true },
  list: generateListObjects(1000), // Generate 1000 items for virtualization demo
  addBrowserTooltipToLabel: true
};

export const WithPagination = () => {
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [list, setList] = React.useState(generateListObjects(5));

  const loadMore = React.useCallback((page) => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const newPageCount = pageCount + 1;
    
    console.log("Loading more items... called times: ", newPageCount);
    
    // Simulate loading delay
    setTimeout(() => {
      setList(prevList => [...prevList, ...generateListObjects(3)]);
      
      setPageCount(newPageCount);
      setIsLoading(false);
      setHasMore(newPageCount < 10); // Stop after 10 pages
    }, 1000);
  }, [isLoading, hasMore, pageCount]);

  const loader = <div key="loader">Loading more items...</div>;

  return (
    <Component
      searchPlaceholder="Search location"
      showCheckboxBeforeText={true}
      noDataScreen={getNoDataScreen()}
      list={list}
      infiniteScrollProps={{
        hasMore: hasMore,
        loadMore: loadMore,
        loader: loader,
        useWindow: false,
        initialLoad: false,
        threshold: 250,
        containerHeight: "170px",
        isPaginated: true,
        handleSearch: (val) => console.log("search for : ", val)
      }}
      checkBoxCallback={(item, e, type) => {
        console.log("Checkbox clicked:", item, type);
      }}
    />
  );
};

export const WithFieldDrivenSearch = () => {
  const [searchType, setSearchType] = React.useState('all');

  const sampleList = generateListObjects(1000).map((item, index) => ({
    ...item,
    label: `${['Pages', 'Locations', 'Handles', 'Posts'][index % 4]} - ${item.label}`,
    type: ['pages', 'locations', 'handles', 'posts'][index % 4]
  }));

  const handleCheckboxChange = (item, e, action, list) => {
    console.log("handleCheckboxChange triggered");
  };

  return (
    <Component
      list={sampleList}
      checkedBoxData={{}}
      checkBoxCallback={handleCheckboxChange}
      showCheckboxBeforeText={true}
      noDataScreen={getNoDataScreen()}
      virtualizationProps={{ isEnabled: true }}
      fieldDrivenSearchOptions={{
        enabled: true,
        fieldOptions: [
          { label: 'All', value: 'all' },
          { label: 'Pages', value: 'pages' },
          { label: 'Locations', value: 'locations' },
          { label: 'Handles', value: 'handles' },
          { label: 'Posts', value: 'posts' }
        ],
        selectedSearchType: searchType
      }}
      searchDebounceDelay={300}
    />
  );
};
