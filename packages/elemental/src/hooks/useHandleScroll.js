import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";

const useHandleScroll = ({ 
    initialPage = 1, 
    hasMore = true, 
    loading = false, 
    rootMargin = 0, 
    isBody = false
}) => {

    const [page, setPageNum] = useState(initialPage);
    const scrollableElemRef = useRef(null);
    const prevHasMore = useRef(null);
    const prevLoading = useRef(null);

    const setPage = () => {
        setPageNum(initialPage);
    };

    useEffect(() => {
        prevHasMore.current = hasMore;
    }, [hasMore]);

    useEffect(() => {
        prevLoading.current = loading;
    }, [loading]);

    const handleScroll = useCallback(() => {
        const scrollableElem = isBody ? document.body : scrollableElemRef?.current;  
        const { scrollHeight, scrollTop, clientHeight } = scrollableElem;
        if ((scrollHeight - scrollTop) == clientHeight && !prevLoading.current && prevHasMore?.current && !rootMargin) {
            setPageNum(prevPage => prevPage + 1);
        }
        if (((scrollHeight - scrollTop) <= (clientHeight + rootMargin)) && !prevLoading.current && prevHasMore?.current && rootMargin) {
            setPageNum(prevPage => prevPage + 1);
        }
    }, [prevHasMore?.current]);

    const debouncedHandleScroll = debounce(handleScroll, 100);

    useEffect(() => {
        const scrollableElem = isBody ? document.body : scrollableElemRef?.current;  
        scrollableElem?.addEventListener("scroll", debouncedHandleScroll);
        return () => scrollableElem.removeEventListener("scroll", debouncedHandleScroll);
    }, []);
    return { page, setPage, scrollableElemRef: isBody ? null : scrollableElemRef };
};

export default useHandleScroll;