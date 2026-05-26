import React, { useEffect, useRef } from 'react'

interface Props {
    noOfShimmers: number,
    initialLoader?: boolean,
    onListViewBottomReached?: () => void;
};

const ListViewLoader: React.FC<Props> = (props) => {
    const {
        noOfShimmers,
        initialLoader = false,
        onListViewBottomReached
    } = props;

    const targetRef = useRef(null);

    useEffect(() => {
        if (!initialLoader) {
            const options = {
                root: null, // use the viewport as the root
                rootMargin: '0px', // no margin
                threshold: 0 // intersecting at any degree
            };
    
            const observer = new IntersectionObserver(entries => {
                let listViewCallInProcess = localStorage.getItem("listViewCallInProcess");
                listViewCallInProcess = JSON.parse(listViewCallInProcess || "{}"); 

                entries.forEach(entry => {
                    if (entry.isIntersecting && !listViewCallInProcess) {
                        onListViewBottomReached && onListViewBottomReached();
                        localStorage.setItem("listViewCallInProcess", JSON.stringify(true));
                    }
                });
            }, options);
    
            if (targetRef.current) {
                observer.observe(targetRef.current);
            }
    
            // Cleanup: disconnect the observer when component unmounts
            return () => {
                observer.disconnect();
            };
        }
    }, []);


    const renderJSX = () => {
        const htmlJSX = [];

        for (let loader = 0; loader < noOfShimmers; loader++) {
            htmlJSX.push(
                <div className={`shimmer-list-view-wrapper ${initialLoader ? "initialLoader" : ""}`}>
                    <div className="circular-wrapper">
                        <span className="bar" />
                    </div>
                    <div className="shimmer-card">
                        <div className="shimmer-name" />
                        <div className="shimmer-heading" />
                        <div>
                            <div className="shimmer-content" />
                        </div>
                        <div className="shimmer-footer" />
                    </div>
                </div>
            )
        } 

        return htmlJSX;
    }

    return (
        <div ref={targetRef} className="rbc-list-view rbc-list-view-shimmer">
            {renderJSX()}
        </div>
    )
}

export default ListViewLoader