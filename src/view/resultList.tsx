import { usePlugin } from "../util/hooks";
import ResultItem from "./resultItem";
import React, { useEffect, useRef } from "react";

const ResultList = ({ data, update }: any) => {
    const ref = useRef();
    const plugin = usePlugin();
    const updater = () => {
        if (update)
            (ref as any).current.scrollTo({ behavior: "smooth", top: "0px" });
    };
    useEffect(() => updater);
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
