import { useEffect } from "react";

const useInfiniteScroll = (callback) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && callback(),
      { threshold: 1 }
    );

    const target = document.querySelector("#scroll-trigger");
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [callback]);
};

export default useInfiniteScroll;
