import React from "react";
import type { DropdownProps, SelectOption } from "../util/types";
import { DROPDOWN_OPTIONS } from "src/util/constants";

export const Dropdown = ({
    options,
    selected,
    onSelectedChange,
    innerRef,
    plugin,
}: DropdownProps) => {
    const downloadType = (selection: SelectOption) => {
        return selection.label === plugin.settings.downloadType;
    };
    const defaultValue = DROPDOWN_OPTIONS.find(downloadType).value;
    const defaultLabel = DROPDOWN_OPTIONS.find(downloadType).label;
    const mappedDropdownOptions = options.map((option) => {
        return (
            option.label != plugin.settings.downloadType && (
                <option
                    key={option.value}
                    className="item"
                    onClick={(e) => onSelectedChange(option.value)}
                    onChange={(e) => onSelectedChange(option.value)}
                    value={option.value}
                >
                    {" "}
                    {option.label}
                </option>
            )
        );
    });

    return (
        <select
            defaultValue={plugin.settings.downloadType}
            ref={innerRef}
            style={{
                paddingTop: "1.5px",
                paddingBottom: "2px",
                minWidth: "90px",
            }}
            className="dropdown action-button"
        >
            <option
                key={defaultValue}
                className="item"
                onClick={(e) => onSelectedChange(defaultValue)}
                onChange={(e) => onSelectedChange(defaultValue)}
                value={defaultValue}
            >
                {defaultLabel}
            </option>
            {mappedDropdownOptions}
        </select>
    );
};
