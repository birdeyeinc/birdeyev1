import React from 'react';
import styles from './ChartComponent.module.scss';
import TableGrid from 'components/TableGrid';

const TableComponent = ({ config, metaDataConfig, tableContainerClass, onExpand, isModal = false }) => {
    console.log("config", config);
    console.log("metaDataConfig", metaDataConfig);
    return (
        <div className={styles.tableGridContainer}>
            <div className={styles.tableTitle}>{config?.title?.text}</div>
            <TableGrid
                enableResize={true}
                tableContainerClass={tableContainerClass}
                tableData={{
                    totalCount: config?.dataGridOptions?.length,
                    headerData: config?.dataGridOptions?.headerData,
                    data: config?.dataGridOptions?.data,
                }}
                metadataConfig={metaDataConfig ? metaDataConfig : {}}
                isHeaderFixed={true}
            />
        </div>
    );
};

// const TableComponent = ({ config, onExpand, isModal = false }) => {
//   const { dataGridOptions, title, subtitle, chart_id } = config;

//   if (!dataGridOptions || !dataGridOptions.data) {
//     return <div className={styles.chartError}>No table data available</div>;
//   }

//   const { columns, rows } = dataGridOptions.data;

//   const tableContent = (
//     <div className={styles.tableWrapper}>
//       {title && <h3 className={styles.tableTitle}>{title.text}</h3>}
//       {subtitle && <p className={styles.tableSubtitle}>{subtitle.text}</p>}

//       <div
//         className={styles.tableScrollContainer}
//         style={isModal ? { maxHeight: '60vh' } : {}}
//       >
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 {columns.map((column, index) => (
//                   <th key={index}>{column.name}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {row.map((cell, cellIndex) => (
//                     <td key={cellIndex}>{cell}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   // For modal view, don't show the container and toolkit wrapper
//   if (isModal) {
//     return tableContent;
//   }

//   // For regular view, include container and toolkit wrapper
//   return (
//     <div className={styles.chartContainer}>
//       {tableContent}

//       {/* <div className={styles.toolkitWrapper}>
//         {onExpand && (
//           <div>
//             <div>
//               <ExpandButton onClick={onExpand} />
//             </div>
//           </div>
//         )}
//       </div> */}
//     </div>
//   );
// };

export default TableComponent;
