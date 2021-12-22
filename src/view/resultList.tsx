import React from "react";
import { usePlugin } from "./hooks";

import ResultItem from "./resultItem";
const ResultList = ({ data }: any) => {
    let items = data.map((photo: any) => (
        <ResultItem key={photo.id} photo={photo} plugin={usePlugin()} />
    ));
    return (
        <div
            className="search-results js-search-results"
            style={{ maxHeight: "72vh", overflowY: "scroll" }}
        >
            {items}
        </div>
    );
};

export default ResultList;
