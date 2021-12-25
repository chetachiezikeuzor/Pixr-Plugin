import usePlugin from "./hooks";
import ResultItem from "./resultItem";
import React, { useEffect, useRef } from "react";

const ResultList = ({ data, update }: any) => {
    const updater = () => {
        if (update)
            (ref as any).current.scrollTo({ behavior: "smooth", top: "0px" });
    };
    useEffect(() => updater);
    const ref = useRef();
    const plugin = usePlugin();
    let items = data.map((photo: any) => (
        <ResultItem key={photo.id} photo={photo} plugin={plugin} />
    ));
    return (
        <ul ref={ref} className="search-results">
            {items}
        </ul>
    );
};

export default ResultList;
