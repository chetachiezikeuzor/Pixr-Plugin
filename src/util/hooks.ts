import { useState } from "react";
import { PluginContext } from "../util/context";
import * as React from "react";
import PixrPlugin from "../plugin/main";

export const usePlugin = (): PixrPlugin => {
    return React.useContext(PluginContext);
};

export const useModal = () => {
    const [isShowing, setIsShowing] = useState(false);

    function toggle() {
        setIsShowing(!isShowing);
    }

    return {
        isShowing,
        toggle,
    };
};
