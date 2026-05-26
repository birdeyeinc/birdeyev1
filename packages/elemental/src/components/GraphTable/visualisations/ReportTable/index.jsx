import React, { useState } from "react";
import TableContainer from "../Table";
import ExpandButton from "../custom/ExpandButton";
import ReportTableModal from "./ReportTableModal";
import style from "./ReportTable.module.scss";
import { orderBy } from "lodash";

function ReportTable({ reportConfig }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const reportConfigWithSortingHandler = {
                        ...reportConfig,
                        parserConfig: {
                            ...reportConfig.parserConfig,
                            tableConfig: {
                                ...reportConfig.parserConfig.tableConfig,
                                sortProps: {
                                    ...reportConfig.parserConfig.tableConfig.sortProps,
                                    sortingHandler: ({ sortby: columnKey, sortOrder, rowsData, index }) => {
                                        console.log({ columnKey, sortOrder, rowsData });
                                        let sortedArray;
                                        const order = sortOrder == 0 ? "asc" : "desc";
                                        sortedArray = orderBy(rowsData, (row) => row.rowData[index]?.value, [order]);
                                        console.log(sortedArray);
                                        return sortedArray;
                                    },
                                },
                            },
                        },
                    };

    return (
        <>
            <div className={style.chatTable}>
                <TableContainer
                    reportConfig={reportConfigWithSortingHandler}
                />
            </div>
            <div className={style.buttonContainer}>
                <div></div>
                <div>
                    <ExpandButton
                        onClick={() => {
                            handleModalOpen();
                        }}
                    />
                </div>
            </div>

            {isModalOpen ? <ReportTableModal isOpen={isModalOpen} onClose={handleModalClose} reportConfig={reportConfigWithSortingHandler} /> : null}
        </>
    );
}

export default ReportTable;
