import React, { useState } from 'react';
import InfiniteScrollList from '.';
import styles from "./InfiniteScrollList.module.scss";

export default {
    title: 'Atom/InfiniteScrollList',
    component: InfiniteScrollList,
    tags: ["autodocs"],
    argTypes: {
        items: { control: 'object' },
        hasMore: { control: 'boolean' },
        loadMore: { action: 'loadMore' },
        renderItem: { control: false },
        useWindow: { control: 'boolean' },
        loaderComponent: { control: false },
        pageStart: { control: 'number' },
        className: { control: 'text' },
    },
    parameters: {
        layout: 'padded',
    }
};

// Helper function to generate sample items
const generateItems = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
        description: `This is the description for item ${i + 1}`,
        value: Math.floor(Math.random() * 1000),
    }));
};

// Default template
const Template = (args) => {
    const [items, setItems] = useState(generateItems(20));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLoadMore = () => {
        if (loading) return;
        
        setLoading(true);
        args.loadMore();
        
        // Simulate API call
        setTimeout(() => {
            const newItems = generateItems(20);
            setItems(prev => [...prev, ...newItems]);
            
            // Stop loading after 100 items
            if (items.length + newItems.length >= 100) {
                setHasMore(false);
            }
            
            setLoading(false);
        }, 1000);
    };

    const renderItem = (item, index) => (
        <div 
            key={item.id}
            className={styles["infinite-scroll-item"]}>
            <h3>
                {item.title}
            </h3>
            <p>
                {item.description}
            </p>
            <span className={styles["infinite-scroll-value"]}>
                Value: {item.value}
            </span>
        </div>
    );

    return (
        <div className={styles["infinite-scroll-container-wrapper"]}>
            <InfiniteScrollList
                items={items}
                hasMore={hasMore}
                loadMore={handleLoadMore}
                renderItem={renderItem}
                useWindow={args.useWindow}
                pageStart={args.pageStart}
                className={args.className}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    useWindow: false,
    pageStart: 0,
};

Default.parameters = {
    docs: {
        source: {
            code: `<InfiniteScrollList
    items={items}
    hasMore={hasMore}
    loadMore={handleLoadMore}
    renderItem={renderItem}
    useWindow={false}
    pageStart={0}
/>`,
            language: 'jsx',
            format: true,
        },
    },
};

// Story with window scroll
export const WithWindowScroll = Template.bind({});
WithWindowScroll.args = {
    useWindow: true,
    pageStart: 0,
};

WithWindowScroll.parameters = {
    docs: {
        description: {
            story: 'This variant uses window scroll instead of container scroll. Scroll the entire page to trigger load more.',
        },
    },
};

// Story with custom loader
export const WithCustomLoader = () => {
    const [items, setItems] = useState(generateItems(20));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLoadMore = () => {
        if (loading) return;
        
        setLoading(true);
        
        setTimeout(() => {
            const newItems = generateItems(20);
            setItems(prev => [...prev, ...newItems]);
            
            if (items.length + newItems.length >= 100) {
                setHasMore(false);
            }
            
            setLoading(false);
        }, 1000);
    };

    const renderItem = (item, index) => (
        <div 
            key={item.id}
            className={styles["infinite-scroll-item"]}>
            <h3>
                {item.title}
            </h3>
            <p>
                {item.description}
            </p>
        </div>
    );

    const customLoader = (
        <div className={styles["infinite-scroll-item-box-wrap"]}>
            <div className={styles["infinite-scroll-inner-item-box-wrap"]}/>
            Loading more items...
        </div>
    );

    return (
        <div className={styles["infinite-scroll-container-wrapper"]}>
            <InfiniteScrollList
                items={items}
                hasMore={hasMore}
                loadMore={handleLoadMore}
                renderItem={renderItem}
                loaderComponent={customLoader}
                useWindow={false}
            />
        </div>
    );
};

WithCustomLoader.parameters = {
    docs: {
        description: {
            story: 'Example with a custom loader component instead of the default loader.',
        },
    },
};

// Story with no more items
export const NoMoreItems = () => {
    const items = generateItems(30);

    const handleLoadMore = () => {
        console.log('Load more called, but hasMore is false');
    };

    const renderItem = (item, index) => (
        <div 
            key={item.id}
            className={styles["infinite-scroll-item"]}>
            <h3>
                {item.title}
            </h3>
            <p>
                {item.description}
            </p>
        </div>
    );

    return (
        <div className={styles["infinite-scroll-container-wrapper"]}>
            <InfiniteScrollList
                items={items}
                hasMore={false}
                loadMore={handleLoadMore}
                renderItem={renderItem}
                useWindow={false}
            />
        </div>
    );
};

NoMoreItems.parameters = {
    docs: {
        description: {
            story: 'Example when all items have been loaded (hasMore is false).',
        },
    },
};

