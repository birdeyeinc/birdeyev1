import { SelectItem } from "atoms/Select";
import PillSelectionDropdown from "./index";

export default {
  title: "Component/PillSelectionDropdownModule",
  component: PillSelectionDropdown,
};

const PillSelectItem = ({
  isDisabled,
  isSelected,
  id,
  label,
  src,
  subTitle,
  value,
}) => {
  return (
    <SelectItem
      key={id}
      value={value}
      selectItemClass={style["pill-item"]}
      disabled={isDisabled}
    >
      <div className={`${style["pill-info"]}`}>
        <Avatar
          alt={label}
          src={src}
          size="medium"
          styleObj={{ border: "1px solid #EEEEEE" }}
        />
        <div>
          <h4 className={`${style["title"]}`}>{label}</h4>
          {subTitle ? (
            <span className={`${style["subtitle"]}`}>
              {subTitle || 0} locations
            </span>
          ) : null}
        </div>
      </div>
      <input
        className={`${style["pill-checkbox"]}`}
        type="checkbox"
        name={label}
        checked={isSelected}
        disabled={isDisabled}
        readOnly
        id={id}
      />
    </SelectItem>
  );
};

export const PillSelectionDropdownModule = {
  args: {
    items: [
      {
        groupId: 9,
        name: "Chick-Fil-A",
        locationCount: 90,
        colour: "#FC8943",
      },
      {
        groupId: 6,
        name: "Chipotle",
        locationCount: 0,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
        colour: "#6665DD",
        isDisabled: true,
        disableTooltipText: "Disable Tooltip Text"
      },
      {
        groupId: 8,
        name: "In-N-Out",
        locationCount: 1,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
        colour: "#FBC123",
      },
      {
        groupId: 5,
        name: "Joella's",
        locationCount: 5,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
        colour: "#0099FF",
      },
      {
        groupId: 10,
        name: "PDQ",
        locationCount: 12,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
        colour: "#DB61DB",
      },
      {
        groupId: 1,
        name: "Panera",
        locationCount: 129,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
      },
      {
        groupId: 3,
        name: "Raising Canes",
        locationCount: 47,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
      },
      {
        groupId: 7,
        name: "Shake Shack",
        locationCount: 46,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
      },
      {
        groupId: 4,
        name: "Slim Chickens",
        locationCount: 20,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
      },
      {
        groupId: 12,
        name: "Wingstop",
        locationCount: 69,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
      },
      {
        groupId: 11,
        name: "Zaxbys",
        locationCount: 15,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
      },
    ],
    initialSelectedItems: [
      {
        groupId: 9,
        name: "Chick-Fil-A",
        locationCount: 90,
        colour: "#FC8943",
      },
      {
        groupId: 8,
        name: "In-N-Out",
        locationCount: 33,
        logoUrl:
          "https://d1py4eyp5hehj0.cloudfront.net/upload/1298481/1711607013627/defaultbusiness.png",
        colour: "#FBC123",
      },
    ],
    primaryIdKey: "groupId",
    labelKey: "name",
    logoKey: "logoUrl",
    onCloseDropdown: (selectedValues) => {console.log({selectedValues})},
    filterKeyValue: "competitorGroupIds",
    itemSubTitleKey: "locationCount",
    itemSubTitleLabel: (({subTitle})=> subTitle<=1 ? 'location' : 'locations'),
    placeHolderText: "Select up to 5 competitors",
    itemComponent: PillSelectItem,
    titleOptions: {dropDownTitle: "Competitors",
      dropDownTitleTooltip: "min 3 and max 5 competitors allowed for selection"},
    BE: {
      env: {
        businessImageCdnBase: "http://ddjkm7nmu27lx.cloudfront.net/",
      },
      business: {
        businessNumber: 159726269368132,
      },
    },
    isSingleSelection: false,
    maxSelectionConfig: {
      maxSelectionCount: 5,
      maxSelectionCountTooltipText: "Max 5 competitors allowed for selection",
    },
    minSelectionConfig: {
      minSelectionCount: 3,
      minSelectionCountTooltipText: "Min 3 competitors required for selection",
    },
    detailPopupOtions: {
      fetchDetails: () => {
        return new Promise((res) =>
          setTimeout(() => {
            res([
              "Delhi",
              "Ahmedabad",
              "Gurgaon",
              "Banglore",
              "Pune",
              "Mumbai",
              "Jamnagar",
              "Vadodara",
              "Navsari",
              "Nasik",
              "Kutch",
            ]);
          }, 1000)
        );
      },
    },
    isInfinite: false,
    infiniteScrollProps: {
        hasMore: true,
        loadMore: (arg) => {
          console.log({arg});
        },
    }
  },
  argTypes: {
    items: {
      control: { type: "array" },
      description: "The current active page",
    },
    initialSelectedItems: {
      control: { type: "array" },
      description: "Total number of pages",
    },
    primaryIdKey: {
      control: "string",
      description: "Number of items per page",
    },
    labelKey: { control: "text", description: "Custom CSS class for styling" },
    logoKey: {
      control: "text",
      description: "Flag to render custom text for prev/next buttons",
    },
    onCloseDropdown: {
      control: { type: "function" },
      description: "Flag to show page size selector",
    },
    filterKeyValue: {
      control: "text",
      description: "Position of the page size selector",
    },
    placeHolderText: { control: "text", description: "Custom wrapper class" },
    BE: {
      control: { type: "object" },
      description: "Flag for new pagination style",
    },
    isSingleSelection: { control: { type: "boolean" } },
    dropdownTitle: { control: { type: "text" } },
    onSelectionChange: (event, value, isOpen, currentValue, checked)=>{ console.log({event, value, isOpen, currentValue, checked}) }
  },
};
