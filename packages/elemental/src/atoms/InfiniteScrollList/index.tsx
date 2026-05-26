import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./InfiniteScrollList.module.scss";
import LoaderBox from "atoms/LoaderBox";

export interface InfiniteScrollListProps {
    pageStart?: number;
    items: any[];
    hasMore: boolean;
    loadMore: () => void;
    renderItem: (item: any, index: number) => React.ReactNode;
    useWindow?: boolean;
    loaderComponent?: React.ReactNode;
    className?: string;
}

const InfiniteScrollList: React.FC<InfiniteScrollListProps> = ({
    pageStart = 0, 
    items,
    hasMore,
    loadMore,
    renderItem,
    useWindow = false,
    loaderComponent,
}) => {
    
    const defaultLoader = (
        <div className="clearfix" key="loader">
            <LoaderBox type={"loader-birdeye"} reseller={false} />
        </div>
    );

    return (
        <div className={styles["infinite-scroll-container"]}>
            <InfiniteScroll
                pageStart={pageStart}
                loadMore={loadMore}
                hasMore={hasMore}
                loader={loaderComponent || defaultLoader}
                useWindow={useWindow}
            >
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        {renderItem(item, index)}
                    </React.Fragment>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default InfiniteScrollList;

