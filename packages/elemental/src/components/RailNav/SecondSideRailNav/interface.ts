export interface SecondSideRailNavProps {
  disabled: boolean;
  heading: string;
  staticMenuData: any;
  dispatch: any;
  onClickCreateButton: any;
  searchTerm: string;
  selectedOption: any;
  subSubOptions: any;
  isSearchFoundInStaticMenuChildren?: boolean;
  handleSelectedOption: (selectedOptionObj: any, isStaticSelectedOption: boolean, isReportSelected: boolean) => void;
  updateSubSubOptions: ({ }) => void;
  handleSearchInStaticMenuChildren: (flag: boolean) => void;
  onNavItemClick: (e: any, href?: string, indexHierarchy?: any) => void;
  moduleName: string;
  customOptionsCount?: any;
  customOptionsCountByIdentifier?: boolean,
  ctaButtonShow?: boolean;
  ctaButtonType?: string;
  ctaButtonLabel?: string;
  ctaButtonIcon?: string;
  ctaButtonCallback?: Function;
  ctaButtonCaption?: string;
  ctaButtonDisabled?: boolean;
  ctaButtonTooltip?: any;
  allowRenavigation?: boolean;
  localChangesPresent?: boolean;
  onContextMenuClick?: Function;
  connectSocialButton?: boolean;
  ctaButtonCallbackForBulkSchedule?: Function;
  bulkScheduleStatus?: string;
  bulkSchedulngPermission?: boolean;
  preventDefaultSubOptionClose?: boolean;
  accordionState?: AccordionStateInterface;
  closeAccordionHandler: Function,
  ctaButtonDisabledClass?: string;
  overflowThreshold?: number;
  resetParentAccordionIndex: number | null;
}
export interface SecondSideRailNavViewProps {
  staticMenuData: any;
  toggleSubOptions: any;
  parentIndexClicked: number | null;
  handleDynamicMenuSelection: any;
  dispatch?: any;
  subSubOptions: any;
  selectedOption: any;
  searchTerm: string;
  isSearchFoundInStaticMenuChildren?: boolean;
  handleViewSubOption: (parentOptionIndex: number, searchTerm: string) => void;
  handleMouseEnter: (parentOptionIndex: number, subIndex: number) => void;
  handleMouseLeave: Function;
  handleOptionSelections: (e: any, parentIndex: number, subIndex: number | null, subSubIndex: number | null, href?: string, hrefOptionObj?: any) => void;
  handleSearchInStaticMenuChildren: (flag: boolean) => void;
  handleSubOptionCount: (parentOption: any) => number;
  moduleName: string;
  customOptionsCount?: any;
  customOptionsCountByIdentifier?: boolean,
  ctaButtonShow?: boolean;
  ctaButtonType?: string;
  ctaButtonLabel?: string;
  ctaButtonIcon?: string;
  ctaButtonCallback?: Function;
  ctaButtonCaption?: string;
  ctaButtonDisabled?: boolean;
  ctaButtonTooltip?: any;
  allowRenavigation?: boolean;
  onContextMenuClick?: Function;
  connectSocialButton?: boolean;
  ctaButtonCallbackForBulkSchedule?: Function;
  bulkScheduleStatus?: string;
  bulkSchedulngPermission?: boolean;
  accordionState?: AccordionStateInterface;
  ctaButtonDisabledClass?: string;
  overflowThreshold?: number;
}

export interface SecondSideRailNavState {
  toggleSubOptions: any;
  accordionState?: AccordionStateInterface
}

export interface AccordionStateInterface {
  accordionState?: { [key: string]: boolean } | {}
}