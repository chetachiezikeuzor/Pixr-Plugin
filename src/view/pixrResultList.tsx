import { usePlugin } from "../util/hooks";
import PixrResultItem from "./pixrResultItem";
import React, { useEffect, useRef } from "react";

const PixrResultList = ({ data, update }: any) => {
    const ref = useRef();
    const plugin = usePlugin();
    const updater = () => {
        if (update)
            (ref as any).current.scrollTo({ behavior: "smooth", top: "0px" });
    };
    useEffect(() => updater);
    let items = data.map((photo: any) => (
        <PixrResultItem key={photo.id} photo={photo} plugin={plugin} />
    ));
    return (
        <ul
            ref={ref}
            className="pixr-search-results"
            style={{ resize: "vertical" }}
        >
            {items}
        </ul>
    );
};

export default PixrResultList;
