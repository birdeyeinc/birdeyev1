import React, { useState } from "react";
import ChipGroup from ".";
import LoaderBox from "atoms/LoaderBox";

export default {
  title: "Atom/ChipGroup",
  component: ChipGroup,
  tags: ["autodocs"],
};

/* ─── helper icons ─── */
const CloseIcon = () => <i className="icon_phoenix-enclose" />;
const VariableIcon = () => <span>{`{x}`}</span> ;
const DocIcon = () => <i className="icon_phoenix-link-image" style={{color: "#303030"}} />;
const LinkIcon = () => <i className="icon_phoenix-link-image" style={{color: "#303030"}} />;
const AddIcon = () => <i className="icon_phoenix-add_circle" style={{color: "#2652ED"}} />;
const BrandIcon = () => <i className="icon_phoenix-home" />;
const IndustryIcon = () => <i className="icon_phoenix-package" />

/* ─── sample chip data matching the reference image ─── */
const sampleChips = [
  {
    id: "business-id",
    label: "Business_ID",
    variant: "outlinedIconFilled",
    colorType: "blue",
    leftIcon: VariableIcon,
    rightIcon: CloseIcon,
    onIconClick: () => alert("Remove Business_ID"),
  },
  {
    id: "products-pdf",
    label: "Products.PDF",
    variant: "outlinedIconFilled",
    colorType: "green",
    leftIcon: DocIcon,
    rightIcon: CloseIcon,
    onIconClick: () => alert("Remove Products.PDF"),
  },
  {
    id: "website",
    label: "www.aspendental.com",
    variant: "outlinedIconFilled",
    colorType: "green",
    leftIcon: LinkIcon,
    rightIcon: CloseIcon,
    onIconClick: () => alert("Remove website"),
  },
  {
    id: "brand-profile",
    label: "Brand profile",
    variant: "outlinedIconFilled",
    colorType: "purple",
    leftIcon: BrandIcon,
    rightIcon: CloseIcon,
    onIconClick: () => alert("Remove Brand profile"),
  },
  {
    id: "style-voice",
    label: "Style and voice",
    variant: "outlinedIconFilled",
    colorType: "purple",
    leftIcon: BrandIcon,
    rightIcon: CloseIcon,
    onIconClick: () => alert("Remove Style and voice"),
  },
  {
    id: "industry",
    label: "Industry context",
    variant: "outlinedIconFilled",
    colorType: "yellow",
    leftIcon: IndustryIcon,
    rightIcon: CloseIcon,
    onIconClick: () => alert("Remove Industry context"),
  },
];

/* ─── Stories ─── */

const Template = (args) => <ChipGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  chips: sampleChips,
  showAddButton: true,
  addButtonLabel: "Add",
  addButtonIcon: AddIcon,
  onAdd: () => alert("Add clicked"),
};

export const DisabledGroup = Template.bind({});
DisabledGroup.args = {
  chips: sampleChips,
  showAddButton: true,
  addButtonLabel: "Add",
  addButtonIcon: AddIcon,
  onAdd: () => alert("Add clicked"),
  disabled: true,
};

/* ─── Add Content example ─── */

const SampleAddForm = ({ onClose }) => (
  <div style={{ padding: 12, border: "1px solid #ccc", borderRadius: 6, marginTop: 4, maxWidth: 320 }}>
    <p style={{ margin: "0 0 8px", fontWeight: 500 }}>Add a new chip</p>
    <input type="text" placeholder="Enter label…" style={{ width: "100%", padding: "6px 8px", marginBottom: 8, borderRadius: 4, border: "1px solid #ccc" }} />
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={onClose} style={{ padding: "4px 12px", borderRadius: 4, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Cancel</button>
      <button onClick={onClose} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: "#1B74E4", color: "#fff", cursor: "pointer" }}>Save</button>
    </div>
  </div>
);

export const WithAddContent = Template.bind({});
WithAddContent.args = {
  chips: sampleChips,
  showAddButton: true,
  addButtonLabel: "Add",
  addButtonTheme: "link",
  addButtonIcon: AddIcon,
  addContent: SampleAddForm,
};

/* ─── Infinite Scroll example ─── */

const generateChips = (count, startIndex = 0) =>
  Array.from({ length: count }, (_, i) => ({
    id: `chip-${startIndex + i}`,
    label: `Tag ${startIndex + i + 1}`,
    variant: "outlined",
    colorType: "grey",
    rightIcon: CloseIcon,
    onIconClick: () => {},
  }));

const InfiniteScrollStory = () => {
  const PAGE_SIZE = 10;
  const TOTAL = 50;
  const [chips, setChips] = useState(() => generateChips(PAGE_SIZE));
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setTimeout(() => {
      setChips((prev) => {
        const next = [...prev, ...generateChips(PAGE_SIZE, prev.length)];
        if (next.length >= TOTAL) setHasMore(false);
        return next;
      });
    }, 800);
  };

  const defaultLoader = (
    <div className="clearfix default-loader" key="loader">
      <LoaderBox type="loader" reseller={false} />
    </div>
  );

  return (
    <div style={{ overflow: "auto", border: "1px solid #ccc", borderRadius: 6, padding: 12 }}>
      <ChipGroup
        chips={chips}
        supportInfiniteScroll
        hasMore={true}
        loadMore={loadMore}
        showAddButton
        loaderComponent={defaultLoader}
        addButtonLabel="Add"
        addButtonIcon={AddIcon}
        onAdd={() => alert("Add clicked")}
        infiniteScrollHeight="80px"
        infiniteScrollWidth="50%"
      />
    </div>
  );
};

export const WithInfiniteScroll = InfiniteScrollStory;

/* ─── Custom Container Class example ─── */

export const WithCustomContainerClass = () => (
  <>
    <style>{`
      .custom-chip-group {
        background: #f5f7fa;
        border: 2px dashed #b0bec5;
        border-radius: 12px;
        padding: 16px;
        max-width: 500px;
      }
    `}</style>
    <ChipGroup
      chips={sampleChips}
      showAddButton
      addButtonLabel="Add"
      addButtonIcon={AddIcon}
      onAdd={() => alert("Add clicked")}
      customContainerClass="custom-chip-group"
    />
  </>
);