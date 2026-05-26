// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { memo, useEffect, useState } from 'react';
import noResult from "assets/images/search.svg";
import { HeaderCellProps, HeaderData, MetadataConfig, NormalizedRow, LegacyRow, TableGridCellRendererProps, VirtualizedCellRendererProps } from '../types';

export const COMMON_LOADER_PROPS = {
  isLoading: false,
  type: "loader-birdeye",
  isReseller: false
};

export const COMMON_NO_DATA_PROPS = {
  noResultsImageSrc: noResult,
  subtitle: "Try different keywords or remove selected filters",
  className: "nodata"
};

export const TextCellRenderer = memo(function TextCellRenderer({ rowData }: TableGridCellRendererProps) {
  return <span className="ellipsis value">{rowData?.value ?? "-"}</span>;
});

export const NameCellRenderer = memo(function NameCellRenderer({ rowData }: TableGridCellRendererProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 24px)' }}>
      <span style={{
        fontSize: '14px',
        fontWeight: '400',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>{rowData?.value}</span>
      {rowData?.subName && <small style={{ fontSize: '12px',color: '#888', fontWeight:'400' }}>{rowData.subName}</small>}
    </div>
  );
});

export const SentimentScoreCellRenderer = memo(function SentimentScoreCellRenderer({ rowData }: TableGridCellRendererProps) {
  if(!rowData) return null;
  return (

    <div style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>
      <div style={{display: 'flex', width:'38px', height:'26px',borderRadius:'4px', border:'1px solid', borderColor:rowData.deltaValue > 0 ? '#4CAE3D' : '#F3382B',color:rowData.deltaValue > 0 ? '#4CAE3D' : '#F3382B', alignItems:'center', justifyContent:'center'}}>
        <p style={{fontSize:'13px'}}>{rowData?.value}</p>
      </div>
      {rowData?.delta && (
        <span style={{
          color: rowData.deltaValue > 0 ? '#4CAE3D' : '#F3382B',
          fontSize: '12px'
        }}>
          {rowData.deltaValue > 0 ? '↑' : '↓'} {Math.abs(rowData.deltaValue)}%
        </span>
      )}
    </div>
  );
});

export const TrendsCellRenderer = memo(function TrendsCellRenderer({ rowData }: TableGridCellRendererProps) {
  return (
    <div style={{ fontSize: '12px' }}>
      {rowData?.value?.join(', ') ?? '-'}
    </div>
  );
});

export const DistributionCellRenderer = memo(function DistributionCellRenderer({ rowData }: TableGridCellRendererProps) {
  return (
    <div style={{ fontSize: '11px' }}>
      <div>Pos: {rowData?.value?.pos}%</div>
      <div>Neg: {rowData?.value?.neg}%</div>
      <div>Neu: {rowData?.value?.neu}%</div>
    </div>
  );
});

export const CategoriesCellRenderer = memo(function CategoriesCellRenderer({ rowData }: TableGridCellRendererProps) {
  return (
    <div style={{ fontSize: '12px' }}>
      {rowData?.value?.slice(0, 3).map((cat: { id?: string; name?: string; mentions?: number }, idx: number) => (
        <div key={cat.id || idx}>{cat.name} ({cat.mentions})</div>
      ))}
    </div>
  );
});

export const StatusCellRenderer = memo(function StatusCellRenderer(props: TableGridCellRendererProps) {
  const { rowData } = props;
  const statusValue = rowData?.value;
  const [status, setStatus] = useState<string | number | null | undefined>(statusValue);
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    setStatus(statusValue);
  }, [statusValue]);

  useEffect(() => {
    console.log('StatusCellRenderer render check', {
      rowId: rowData?.rowId,
      status,
      renderTick,
    });
  }, [status, renderTick, rowData?.rowId]);

  const colors = {
    Active: { bg: '#ffff', text: '#2e7d32' },
    Demo: { bg: '#fff3e0', text: '#e65100' },
    Inactive: { bg: '#ffebee', text: '#c62828' },
    Pending: { bg: '#e3f2fd', text: '#1565c0' }
  };
  const style = colors[status as keyof typeof colors] || { bg: '#f5f5f5', text: '#666' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: style.bg,
        color: style.text,
        fontSize: '12px',
        fontWeight: 500
      }}>
        {status ?? '-'}
      </span>
    </div>
  );
});

export const LocationCellRenderer = memo(function LocationCellRenderer({ rowData, _isExpanded, _childrenCount }: TableGridCellRendererProps) {
  useEffect(() => {
    console.log("mount Locationcell");
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 24px)' }}>
      <span style={{
        fontSize: '14px',
        fontWeight: '400',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>{rowData?.value}</span>
      {(_childrenCount ?? 0) > 0 && (
        <small style={{ fontSize: '12px',color: '#888', fontWeight:'400' }}>
          {_isExpanded ? 'Expanded' : `${_childrenCount} sub-locations`}
        </small>
      )}
    </div>
  );
});

export const SortableHeaderRenderer = memo(function SortableHeaderRenderer({ headerData, sortColumn, sortOrder }: HeaderCellProps) {
  const isSorted = sortColumn === headerData?.value;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span>{headerData?.label}</span>
      {headerData?.sortable && isSorted && (
        <span style={{ fontSize: '10px' }}>{sortOrder === 0 ? '▲' : '▼'}</span>
      )}
    </div>
  );
});

export const basicTableHeaders: HeaderData[] = [
  { order: 0, value: "location", label: "Location", enabled: true, sortable: true, copyToClipboard: true, fixed: true },
  { order: 1, value: "business_name", label: "Business Name", enabled: true, sortable: true, copyToClipboard: false, fixed: false },
  { order: 2, value: "created", label: "Created On", enabled: true, sortable: true, copyToClipboard: false, fixed: false },
  { order: 3, value: "created_by", label: "Created By", enabled: true, sortable: false, copyToClipboard: false, fixed: false },
  { order: 4, value: "status", label: "Status", enabled: true, sortable: false, copyToClipboard: false, fixed: false },
  { order: 5, value: "rating", label: "Rating", enabled: true, sortable: false, copyToClipboard: false, fixed: false }
];

export const accordionTableHeaders: HeaderData[] = [
  { order: 0, value: "location", label: "Location", enabled: true, sortable: true, copyToClipboard: true, fixed: true, minWidth: 195 },
  { order: 1, value: "business_name", label: "Business Name", enabled: true, sortable: true, copyToClipboard: false, fixed: false, minWidth: 195 },
  { order: 2, value: "created", label: "Created On", enabled: true, sortable: true, copyToClipboard: false, fixed: false, minWidth: 195 },
  { order: 3, value: "created_by", label: "Created By", enabled: true, sortable: false, copyToClipboard: false, fixed: false, minWidth: 195 },
  { order: 4, value: "status", label: "Status", enabled: true, sortable: false, copyToClipboard: false, fixed: false, minWidth: 195 },
  { order: 5, value: "rating", label: "Rating", enabled: true, sortable: false, copyToClipboard: false, fixed: false, minWidth: 195 }
];

export const sentimentTableHeaders: HeaderData[] = [
  { order: 0, value: "name", label: "Brands", enabled: true, sortable: true, copyToClipboard: false, fixed: false },
  { order: 1, value: "sentiment-score", label: "Sentiment Score", enabled: true, sortable: true, copyToClipboard: false, fixed: false },
  { order: 2, value: "trends", label: "Last 90 Days", enabled: true, sortable: false, copyToClipboard: false, fixed: false },
  { order: 3, value: "distribution", label: "Distribution", enabled: true, sortable: false, copyToClipboard: false, fixed: false },
  { order: 4, value: "most-mention-categories", label: "Most Mentioned Categories", enabled: true, sortable: false, copyToClipboard: false, fixed: false }
];

const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const statuses = ['Active', 'Demo', 'Inactive', 'Pending'];
const creators = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis'];

export const generateBasicRows: (startIndex: number, count: number) => NormalizedRow[] = (startIndex: number, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const statusValue = statuses[index % statuses.length];
    return {
      rowId: `row-${index}`,
      businessId: 100080000 + index,
      rowData: {
        location: { value: `${locations[index % locations.length]} - ${index + 1}` },
        business_name: { value: `Business ${index + 1}` },
        created: { value: `Feb ${(index % 28) + 1}, 2024` },
        created_by: { value: creators[index % creators.length] },
        status: { value: statusValue },
        rating: { value: Math.floor(Math.random() * 5) + 1 },
      },
      status: statusValue
    };
  });
};

export const generateAccordionRows: () => NormalizedRow[] = () => {
  const regions = [
    { name: 'North America', countries: ['USA', 'Canada', 'Mexico'] },
    { name: 'Europe', countries: ['UK', 'Germany', 'France', 'Italy', 'Spain'] },
    { name: 'Asia Pacific', countries: ['Japan', 'China', 'India', 'Australia', 'Singapore'] },
    { name: 'Latin America', countries: ['Brazil', 'Argentina', 'Chile'] }
  ];

  return regions.map((region, regionIdx) => ({
    rowId: `region-${regionIdx}`,
    businessId: 100080000 + regionIdx,
    rowData: {
      location: { value: region.name, subName: `${region.countries.length} countries` },
      business_name: { value: `Regional HQ ${regionIdx + 1}` },
      created: { value: `Jan ${regionIdx + 1}, 2024` },
      created_by: { value: creators[regionIdx % creators.length] },
      status: { value: statuses[regionIdx % statuses.length] }
    },
    expandedRowData: {
      location: { value: `${region.name} (Expanded)`, subName: `Showing ${region.countries.length} sub-locations` },
      business_name: { value: `Regional HQ ${regionIdx + 1}` },
      created: { value: `Jan ${regionIdx + 1}, 2024` },
      created_by: { value: creators[regionIdx % creators.length] },
      status: { value: statuses[regionIdx % statuses.length] }
    },
    children: region.countries.map((country, countryIdx) => ({
      rowId: `region-${regionIdx}-country-${countryIdx}`,
      businessId: 100090000 + regionIdx * 10 + countryIdx,
      rowData: {
        location: { value: country },
        business_name: { value: `${country} Office` },
        created: { value: `Feb ${countryIdx + 1}, 2024` },
        created_by: { value: creators[(regionIdx + countryIdx) % creators.length] },
        status: { value: statuses[(regionIdx + countryIdx) % statuses.length] }
      }
    }))
  }));
};

export const generateSentimentData: () => NormalizedRow[] = () => [
  {
    rowId: 'brand-1',
    rowData: {
      name: { value: 'H&R Block', id: 1499248, subName: '8820 Locations', isSelfBusiness: true },
      'sentiment-score': { value: 44.4, delta: true, deltaValue: 8.3 },
      trends: { value: [36.4, 49.7, 50.8, 48.4, 43.4, 38, 50.4] },
      distribution: { value: { pos: 28.8, neg: 68.7, neu: 2.5 } },
      'most-mention-categories': { value: [{ id: 39910, name: 'Experience', mentions: 221 }, { id: 41007, name: 'Results', mentions: 190 }] }
    }
  },
  {
    rowId: 'brand-2',
    rowData: {
      name: { value: 'Jackson Hewitt', id: 171856, subName: '4829 Locations', isSelfBusiness: false },
      'sentiment-score': { value: 87.8, delta: true, deltaValue: 19.4 },
      trends: { value: [80.4, 83.8, 86.3, 93.3, 90.3, 80.2, 100] },
      distribution: { value: { pos: 79.3, neg: 18.7, neu: 2 } },
      'most-mention-categories': { value: [{ id: 39910, name: 'Experience', mentions: 96 }, { id: 39909, name: 'Staff', mentions: 51 }] }
    }
  },
  {
    rowId: 'brand-3',
    rowData: {
      name: { value: 'Liberty Tax', id: 171857, subName: '1780 Locations', isSelfBusiness: false },
      'sentiment-score': { value: 94, delta: true, deltaValue: 3.6 },
      trends: { value: [85.5, 92.8, 94.8, 96.4, 90.6, 94.6, 100] },
      distribution: { value: { pos: 84, neg: 14.5, neu: 1.5 } },
      'most-mention-categories': { value: [{ id: 39910, name: 'Experience', mentions: 257 }, { id: 39909, name: 'Staff', mentions: 69 }] }
    }
  },
  {
    rowId: 'brand-4',
    rowData: {
      name: { value: 'Turbo Tax', id: 175041, subName: '638 Locations', isSelfBusiness: false },
      'sentiment-score': { value: 95.1, delta: true, deltaValue: -1.7 },
      trends: { value: [96.7, 99.2, 98, 94.9, 82.3, 87.1, 100] },
      distribution: { value: { pos: 88.8, neg: 9.7, neu: 1.6 } },
      'most-mention-categories': { value: [{ id: 39910, name: 'Experience', mentions: 112 }, { id: 39909, name: 'Staff', mentions: 32 }] }
    }
  }
];

export const generateLegacyRows: (startIndex: number, count: number) => LegacyRow[] = (startIndex: number, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    return {
      rowId: `legacy-row-${index}`,
      businessId: 100080000 + index,
      rowData: [
        { value: `${locations[index % locations.length]} - ${index + 1}` },
        { value: `Business ${index + 1}` },
        { value: `Feb ${(index % 28) + 1}, 2024` },
        { value: creators[index % creators.length] },
        { value: statuses[index % statuses.length] }
      ],
      status: statuses[index % statuses.length]
    };
  });
};

export const getActionConfig = () => ({
  categories: [{
    title: "",
    options: [
      { label: "View Details", value: "VIEW", enable: true, callBack: (row: Record<string, unknown>) => console.log("View:", row) },
      { label: "Edit", value: "EDIT", enable: true, callBack: (row: Record<string, unknown>) => console.log("Edit:", row) },
      { label: "Delete", value: "DELETE", enable: true, callBack: (row: Record<string, unknown>) => console.log("Delete:", row) }
    ]
  }]
});

export const rowHoverTableHeaders: HeaderData[] = [
  { order: 0, value: 'businessName', label: 'Business Name', enabled: true, sortable: true, fixed: true },
  { order: 1, value: 'businessId', label: 'Business ID', enabled: true, sortable: true, fixed: false },
  { order: 2, value: 'totalLocations', label: 'Total Locations', enabled: true, sortable: false, fixed: false },
  { order: 3, value: 'mappedLocations', label: 'Mapped Locations', enabled: true, sortable: false, fixed: false },
  { order: 4, value: 'status', label: 'Status', enabled: true, sortable: false, fixed: false }
];

export const rowHoverTableData: { headerData: HeaderData[]; data: NormalizedRow[] } = {
  headerData: rowHoverTableHeaders,
  data: [
    {
      rowId: 'biz-1',
      rowData: {
        businessName: { value: 'Acme Corporation' },
        businessId: { value: 'BIZ-001' },
        totalLocations: { value: 42 },
        mappedLocations: { value: 38 },
        status: { value: 'Active' }
      }
    },
    {
      rowId: 'biz-2',
      rowData: {
        businessName: { value: 'Global Industries' },
        businessId: { value: 'BIZ-002' },
        totalLocations: { value: 128 },
        mappedLocations: { value: 120 },
        status: { value: 'Active' }
      }
    },
    {
      rowId: 'biz-3',
      rowData: {
        businessName: { value: 'Tech Solutions' },
        businessId: { value: 'BIZ-003' },
        totalLocations: { value: 15 },
        mappedLocations: { value: 10 },
        status: { value: 'Pending' }
      }
    },
    {
      rowId: 'biz-4',
      rowData: {
        businessName: { value: 'Local Services' },
        businessId: { value: 'BIZ-004' },
        totalLocations: { value: 3 },
        mappedLocations: { value: 3 },
        status: { value: 'Demo' }
      }
    }
  ]
};

export const generateRowsWithMetadata = (): NormalizedRow[] => {
  return [
    {
      rowId: 'row-1',
      metadata: { className: 'highlighted-row', 'data-row-type': 'featured' },
      rowData: {
        location: { value: 'New York' },
        business_name: { value: 'Business 1' },
        created: { value: 'Feb 1, 2024' },
        created_by: { value: 'John Doe' },
        status: {
          value: 'Active',
          metadata: { className: 'status-active', style: { backgroundColor: '#e6f7e6' } }
        }
      }
    },
    {
      rowId: 'row-2',
      rowData: {
        location: { value: 'Los Angeles' },
        business_name: { value: 'Business 2' },
        created: { value: 'Feb 2, 2024' },
        created_by: { value: 'Jane Smith' },
        status: {
          value: 'Inactive',
          metadata: { className: 'status-inactive', style: { backgroundColor: '#ffebee' } }
        }
      }
    },
    {
      rowId: 'row-3',
      metadata: { className: 'warning-row', id: 'important-row' },
      rowData: {
        location: {
          value: 'Chicago',
          metadata: { className: 'important-cell', style: { fontWeight: '500' } }
        },
        business_name: { value: 'Business 3' },
        created: { value: 'Feb 3, 2024' },
        created_by: { value: 'Bob Wilson' },
        status: {
          value: 'Pending',
          metadata: { className: 'status-pending', style: { backgroundColor: '#e3f2fd' } }
        }
      }
    },
    {
      rowId: 'row-4',
      rowData: {
        location: { value: 'Houston' },
        business_name: { value: 'Business 4' },
        created: { value: 'Feb 4, 2024' },
        created_by: { value: 'Alice Brown' },
        status: {
          value: 'Demo',
          metadata: { className: 'status-demo', style: { backgroundColor: '#fff3e0' } }
        }
      }
    }
  ];
};

export const metadataConfigExample: MetadataConfig = {
  tr: {
    className: 'custom-row',
    'data-testid': 'table-row'
  },
  th: {
    '*': { className: 'custom-header' },
    location: { className: 'header-location', style: { backgroundColor: '#f0f4f8' } },
    status: { className: 'header-status', style: { minWidth: '100px' } }
  },
  td: {
    '*': { className: 'custom-cell' },
    location: { className: 'cell-location' },
    business_name: { className: 'cell-business', style: { fontWeight: 500 } }
  },
  table: {
    className: 'custom-table',
  },
  tableContainer: {
    className: 'custom-table-container',
  },
  tableWrapper: {
    className: 'custom-table-wrapper',
  }
};

export const virtualizedSampleData = Array.from({ length: 50 }, (_, i) => ({
  id: `emp-${i + 1}`,
  name: `Employee ${i + 1}`,
  department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5],
  salary: 50000 + (i * 1000),
  joinDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  status: ['Active', 'On Leave', 'Probation'][i % 3]
}));

export const VirtualizedNameRenderer = ({ cellData, rowData }: VirtualizedCellRendererProps) => {
  if(!rowData) return null;
  return (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <strong>{cellData}</strong>
    <small style={{ color: '#666' }}>{rowData.department}</small>
  </div>
)};

export const VirtualizedSalaryRenderer = ({ cellData }: VirtualizedCellRendererProps) => (
  <span style={{ fontWeight: 500, color: '#2e7d32' }}>
    ${cellData?.toLocaleString()}
  </span>
);

export const VirtualizedStatusRenderer = ({ cellData }: VirtualizedCellRendererProps) => {
  const colors = {
    Active: { bg: '#e6f7e6', text: '#2e7d32' },
    'On Leave': { bg: '#fff3e0', text: '#e65100' },
    Probation: { bg: '#e3f2fd', text: '#1565c0' }
  };
  const style = colors[cellData as keyof typeof colors] || { bg: '#f5f5f5', text: '#666' };

  return (
    <span style={{
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: style.bg,
      color: style.text,
      fontSize: '12px'
    }}>
      {cellData}
    </span>
  );
};

export const RESIZABLE_TABLE_DATA: { headerData: HeaderData[]; data: NormalizedRow[] } = {
  headerData: [
    { value: 'name', label: 'Name', enabled: true, order: 0, sortable: true, width: 180, minWidth: 150, maxWidth: 300 },
    { value: 'email', label: 'Email', enabled: true, order: 1, sortable: true, width: 220, enabledFluidWidth: true },
    { value: 'role', label: 'Role', enabled: true, order: 2, sortable: true, width: 180, enabledFluidWidth: true },
    { value: 'department', label: 'Department', enabled: true, order: 3, width: 160, enabledFluidWidth: true },
    { value: 'location', label: 'Location', enabled: true, order: 4, width: 200, enabledFluidWidth: true },
    { value: 'status', label: 'Status', enabled: true, order: 5, width: 120, enabledFluidWidth: true },
    { value: 'rating', label: 'Rating', enabled: true, order: 6, width: 100, enabledFluidWidth: true }
  ],
  data: [
    { rowId: '1', rowData: { name: { value: 'John Smith' }, email: { value: 'john.smith@company.com' }, role: { value: 'Senior Developer' }, department: { value: 'Engineering' }, location: { value: 'New York, NY' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '2', rowData: { name: { value: 'Sarah Johnson' }, email: { value: 'sarah.johnson@company.com' }, role: { value: 'Product Manager' }, department: { value: 'Product' }, location: { value: 'San Francisco, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '3', rowData: { name: { value: 'Michael Chen' }, email: { value: 'michael.chen@company.com' }, role: { value: 'UX Designer' }, department: { value: 'Design' }, location: { value: 'Austin, TX' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '4', rowData: { name: { value: 'Emily Davis' }, email: { value: 'emily.davis@company.com' }, role: { value: 'Data Analyst' }, department: { value: 'Analytics' }, location: { value: 'Seattle, WA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '5', rowData: { name: { value: 'James Wilson' }, email: { value: 'james.wilson@company.com' }, role: { value: 'DevOps Engineer' }, department: { value: 'Infrastructure' }, location: { value: 'Denver, CO' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '6', rowData: { name: { value: 'James Wilson' }, email: { value: 'james.wilson@company.com' }, role: { value: 'DevOps Engineer' }, department: { value: 'Infrastructure' }, location: { value: 'Denver, CO' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '7', rowData: { name: { value: 'Jessica Martinez' }, email: { value: 'jessica.martinez@company.com' }, role: { value: 'QA Engineer' }, department: { value: 'Quality Assurance' }, location: { value: 'Austin, TX' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '8', rowData: { name: { value: 'David Lee' }, email: { value: 'david.lee@company.com' }, role: { value: 'Frontend Developer' }, department: { value: 'Engineering' }, location: { value: 'San Francisco, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '9', rowData: { name: { value: 'Lisa Anderson' }, email: { value: 'lisa.anderson@company.com' }, role: { value: 'Backend Developer' }, department: { value: 'Engineering' }, location: { value: 'New York, NY' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '10', rowData: { name: { value: 'Robert Taylor' }, email: { value: 'robert.taylor@company.com' }, role: { value: 'DevOps Engineer' }, department: { value: 'Infrastructure' }, location: { value: 'Portland, OR' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '11', rowData: { name: { value: 'Amanda White' }, email: { value: 'amanda.white@company.com' }, role: { value: 'UI Designer' }, department: { value: 'Design' }, location: { value: 'Los Angeles, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '12', rowData: { name: { value: 'Christopher Brown' }, email: { value: 'christopher.brown@company.com' }, role: { value: 'Project Manager' }, department: { value: 'Management' }, location: { value: 'Chicago, IL' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '13', rowData: { name: { value: 'Michelle Garcia' }, email: { value: 'michelle.garcia@company.com' }, role: { value: 'Data Scientist' }, department: { value: 'Analytics' }, location: { value: 'Boston, MA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '14', rowData: { name: { value: 'Daniel Rodriguez' }, email: { value: 'daniel.rodriguez@company.com' }, role: { value: 'Systems Administrator' }, department: { value: 'Infrastructure' }, location: { value: 'Miami, FL' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '15', rowData: { name: { value: 'Jennifer Lopez' }, email: { value: 'jennifer.lopez@company.com' }, role: { value: 'Technical Writer' }, department: { value: 'Documentation' }, location: { value: 'Dallas, TX' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '16', rowData: { name: { value: 'Mark Thompson' }, email: { value: 'mark.thompson@company.com' }, role: { value: 'Security Engineer' }, department: { value: 'Security' }, location: { value: 'Seattle, WA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '17', rowData: { name: { value: 'Karen Jackson' }, email: { value: 'karen.jackson@company.com' }, role: { value: 'HR Manager' }, department: { value: 'Human Resources' }, location: { value: 'Denver, CO' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '18', rowData: { name: { value: 'Steven Martin' }, email: { value: 'steven.martin@company.com' }, role: { value: 'Sales Manager' }, department: { value: 'Sales' }, location: { value: 'Las Vegas, NV' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '19', rowData: { name: { value: 'Patricia Harris' }, email: { value: 'patricia.harris@company.com' }, role: { value: 'Marketing Manager' }, department: { value: 'Marketing' }, location: { value: 'Atlanta, GA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '20', rowData: { name: { value: 'Paul Clark' }, email: { value: 'paul.clark@company.com' }, role: { value: 'Business Analyst' }, department: { value: 'Business' }, location: { value: 'Phoenix, AZ' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '21', rowData: { name: { value: 'Nancy Lewis' }, email: { value: 'nancy.lewis@company.com' }, role: { value: 'Solutions Architect' }, department: { value: 'Engineering' }, location: { value: 'San Diego, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '22', rowData: { name: { value: 'Thomas Walker' }, email: { value: 'thomas.walker@company.com' }, role: { value: 'Junior Developer' }, department: { value: 'Engineering' }, location: { value: 'Austin, TX' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '23', rowData: { name: { value: 'Barbara Hall' }, email: { value: 'barbara.hall@company.com' }, role: { value: 'Content Manager' }, department: { value: 'Marketing' }, location: { value: 'Portland, OR' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '24', rowData: { name: { value: 'Charles Young' }, email: { value: 'charles.young@company.com' }, role: { value: 'Account Manager' }, department: { value: 'Sales' }, location: { value: 'Boston, MA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '25', rowData: { name: { value: 'Margaret Hernandez' }, email: { value: 'margaret.hernandez@company.com' }, role: { value: 'Finance Manager' }, department: { value: 'Finance' }, location: { value: 'New York, NY' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '26', rowData: { name: { value: 'Joseph King' }, email: { value: 'joseph.king@company.com' }, role: { value: 'IT Support Specialist' }, department: { value: 'IT Support' }, location: { value: 'Chicago, IL' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '27', rowData: { name: { value: 'Susan Wright' }, email: { value: 'susan.wright@company.com' }, role: { value: 'Lead Designer' }, department: { value: 'Design' }, location: { value: 'Los Angeles, CA' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '28', rowData: { name: { value: 'Richard Lopez' }, email: { value: 'richard.lopez@company.com' }, role: { value: 'Mobile Developer' }, department: { value: 'Engineering' }, location: { value: 'San Francisco, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '29', rowData: { name: { value: 'Dorothy Hill' }, email: { value: 'dorothy.hill@company.com' }, role: { value: 'Marketing Specialist' }, department: { value: 'Marketing' }, location: { value: 'Seattle, WA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '30', rowData: { name: { value: 'Jeffrey Scott' }, email: { value: 'jeffrey.scott@company.com' }, role: { value: 'Compliance Officer' }, department: { value: 'Legal' }, location: { value: 'Denver, CO' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '31', rowData: { name: { value: 'Joyce Green' }, email: { value: 'joyce.green@company.com' }, role: { value: 'Operations Manager' }, department: { value: 'Operations' }, location: { value: 'Miami, FL' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '32', rowData: { name: { value: 'Ryan Adams' }, email: { value: 'ryan.adams@company.com' }, role: { value: 'Database Administrator' }, department: { value: 'Infrastructure' }, location: { value: 'Dallas, TX' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '33', rowData: { name: { value: 'Diane Nelson' }, email: { value: 'diane.nelson@company.com' }, role: { value: 'Product Designer' }, department: { value: 'Design' }, location: { value: 'Austin, TX' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '34', rowData: { name: { value: 'Jacob Carter' }, email: { value: 'jacob.carter@company.com' }, role: { value: 'Full Stack Developer' }, department: { value: 'Engineering' }, location: { value: 'Las Vegas, NV' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '35', rowData: { name: { value: 'Catherine Roberts' }, email: { value: 'catherine.roberts@company.com' }, role: { value: 'Customer Success Manager' }, department: { value: 'Customer Success' }, location: { value: 'Atlanta, GA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '36', rowData: { name: { value: 'Gary Phillips' }, email: { value: 'gary.phillips@company.com' }, role: { value: 'Infrastructure Architect' }, department: { value: 'Infrastructure' }, location: { value: 'Phoenix, AZ' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '37', rowData: { name: { value: 'Janet Campbell' }, email: { value: 'janet.campbell@company.com' }, role: { value: 'Community Manager' }, department: { value: 'Community' }, location: { value: 'San Diego, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '38', rowData: { name: { value: 'Jerry Parker' }, email: { value: 'jerry.parker@company.com' }, role: { value: 'Release Manager' }, department: { value: 'Operations' }, location: { value: 'Boston, MA' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '39', rowData: { name: { value: 'Anna Evans' }, email: { value: 'anna.evans@company.com' }, role: { value: 'Recruiter' }, department: { value: 'Human Resources' }, location: { value: 'Portland, OR' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '40', rowData: { name: { value: 'Dennis Edwards' }, email: { value: 'dennis.edwards@company.com' }, role: { value: 'System Architect' }, department: { value: 'Engineering' }, location: { value: 'New York, NY' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '41', rowData: { name: { value: 'Brenda Collins' }, email: { value: 'brenda.collins@company.com' }, role: { value: 'Training Coordinator' }, department: { value: 'Human Resources' }, location: { value: 'Chicago, IL' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '42', rowData: { name: { value: 'Larry Stewart' }, email: { value: 'larry.stewart@company.com' }, role: { value: 'Cloud Engineer' }, department: { value: 'Infrastructure' }, location: { value: 'Los Angeles, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '43', rowData: { name: { value: 'Pamela Morris' }, email: { value: 'pamela.morris@company.com' }, role: { value: 'Grant Writer' }, department: { value: 'Finance' }, location: { value: 'San Francisco, CA' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '44', rowData: { name: { value: 'Frank Rogers' }, email: { value: 'frank.rogers@company.com' }, role: { value: 'Network Administrator' }, department: { value: 'Infrastructure' }, location: { value: 'Seattle, WA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '45', rowData: { name: { value: 'Debra Morgan' }, email: { value: 'debra.morgan@company.com' }, role: { value: 'Executive Assistant' }, department: { value: 'Management' }, location: { value: 'Denver, CO' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '46', rowData: { name: { value: 'Wayne Peterson' }, email: { value: 'wayne.peterson@company.com' }, role: { value: 'Product Support Engineer' }, department: { value: 'Support' }, location: { value: 'Miami, FL' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '47', rowData: { name: { value: 'Angela Powell' }, email: { value: 'angela.powell@company.com' }, role: { value: 'Graphic Designer' }, department: { value: 'Design' }, location: { value: 'Dallas, TX' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '48', rowData: { name: { value: 'Marc Long' }, email: { value: 'marc.long@company.com' }, role: { value: 'CRM Analyst' }, department: { value: 'Sales' }, location: { value: 'Austin, TX' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '49', rowData: { name: { value: 'Melissa Patterson' }, email: { value: 'melissa.patterson@company.com' }, role: { value: 'QA Automation Engineer' }, department: { value: 'Quality Assurance' }, location: { value: 'Las Vegas, NV' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '50', rowData: { name: { value: 'Billy Hughes' }, email: { value: 'billy.hughes@company.com' }, role: { value: 'Documentation Manager' }, department: { value: 'Documentation' }, location: { value: 'Atlanta, GA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '51', rowData: { name: { value: 'Carol Flores' }, email: { value: 'carol.flores@company.com' }, role: { value: 'Vendor Manager' }, department: { value: 'Procurement' }, location: { value: 'Phoenix, AZ' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '52', rowData: { name: { value: 'Russell Washington' }, email: { value: 'russell.washington@company.com' }, role: { value: 'Security Analyst' }, department: { value: 'Security' }, location: { value: 'San Diego, CA' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '53', rowData: { name: { value: 'Shirley Butler' }, email: { value: 'shirley.butler@company.com' }, role: { value: 'Brand Manager' }, department: { value: 'Marketing' }, location: { value: 'Boston, MA' }, status: { value: 'On Leave' }, rating: {value: 4} } },
    { rowId: '54', rowData: { name: { value: 'Jack Simmons' }, email: { value: 'jack.simmons@company.com' }, role: { value: 'Load Testing Engineer' }, department: { value: 'Quality Assurance' }, location: { value: 'Portland, OR' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '55', rowData: { name: { value: 'Angela Bryant' }, email: { value: 'angela.bryant@company.com' }, role: { value: 'Accounts Payable Specialist' }, department: { value: 'Finance' }, location: { value: 'New York, NY' }, status: { value: 'Active' }, rating: {value: 4} } },
    { rowId: '56', rowData: { name: { value: 'Billy Alexander' }, email: { value: 'billy.alexander@company.com' }, role: { value: 'Senior Architect' }, department: { value: 'Engineering' }, location: { value: 'Chicago, IL' }, status: { value: 'Active' }, rating: {value: 4} } }
  ].map((row) => ({
    ...row,
    rowData: {
      ...row.rowData,
      rating: { value: 4 }
    }
  }))
};
