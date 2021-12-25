import { PluginContext } from "./context";
import * as React from "react";
import PixrPlugin from "../plugin/main";

const usePlugin = (): PixrPlugin => {
    return React.useContext(PluginContext);
};

export default usePlugin;
