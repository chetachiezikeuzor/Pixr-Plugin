import React, { Component } from "react";
import { DOWNLOAD_SPANS_STYLE, DOWNLOAD_MODAL_STYLE } from "src/util/constants";
import {
    bytesToSize,
    capitalizeFirstLetter,
    downloadImage,
} from "src/util/utils";

export class DownloadConfirmModal extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            chosenImgUrl: null,
            isShowing: null,
            hide: null,
            dimensions: null,
            blob: null,
            imgTitle: capitalizeFirstLetter(this.props.imgTitle),
        };
    }

    handleChange = (e: any) => {
        this.setState({ imgTitle: e.target.value }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state);
            }
        });
    };

    render() {
        let self = this;
        return this.props.isShowing ? (
            <div className="pixr-plugin-modal">
                <button
                    type="button"
                    className="modal-close-button"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={this.props.hide}
                ></button>
                <div className="modal" style={DOWNLOAD_MODAL_STYLE}>
                    <div className="modal-content">
                        <div className="setting-item">
                            <div>
                                <div
                                    className="setting-item-name"
                                    style={{
                                        marginLeft: "0",
                                        marginTop: "18px",
                                        marginBottom: "12px",
                                        marginRight: "22px",
                                        lineHeight: "1.28em",
                                        fontSize: "xx-large",
                                        fontWeight: "900",
                                        textAlign: "left",
                                    }}
                                >
                                    Download this image?
                                </div>
                                <div
                                    className="setting-item-description"
                                    style={{ marginRight: "22px" }}
                                >
                                    <span
                                        style={Object.assign(
                                            {
                                                fontSize: "medium",
                                                textAlign: "center",
                                                width: "100%",
                                                border: 0,
                                                color: "rgba(var(--color-views-pixr),1)",
                                                top: "8px",
                                            },
                                            DOWNLOAD_SPANS_STYLE
                                        )}
                                    >
                                        DIM: {this.props.dimensions.width} x{" "}
                                        {this.props.dimensions.height} px
                                    </span>

                                    <span
                                        style={Object.assign(
                                            {
                                                fontSize: "medium",
                                                textAlign: "center",
                                                width: "100%",
                                                border: 0,
                                                color: "rgba(var(--color-size-pixr),1)",
                                                top: "8px",
                                            },
                                            DOWNLOAD_SPANS_STYLE
                                        )}
                                    >
                                        SIZE:{" "}
                                        {this.props.blob.size
                                            ? bytesToSize(this.props.blob.size)
                                            : bytesToSize(0)}
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    height: "20vh",
                                    flexGrow: 1,
                                    width: "22rem",
                                    overflow: "hidden",
                                    borderRadius: "4px",
                                }}
                            >
                                <img
                                    src={this.props.imgUrl}
                                    alt={`"${capitalizeFirstLetter(
                                        this.props.imgTitle
                                    )}"`}
                                    style={{
                                        height: " 100%",
                                        minWidth: "100%",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        objectFit: "cover",
                                        verticalAlign: "bottom",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <div
                                className="setting-item-info"
                                style={{ marginRight: 0, width: "100%" }}
                            >
                                <div className="setting-item-name">
                                    <input
                                        type="text"
                                        style={{
                                            marginLeft: "1px",
                                            marginRight: "16px",
                                            width: " -webkit-fill-available",
                                        }}
                                        defaultValue={capitalizeFirstLetter(
                                            this.state.imgTitle
                                        )}
                                        placeholder={capitalizeFirstLetter(
                                            this.state.imgTitle
                                        )}
                                        onChange={(e) => {
                                            this.handleChange(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="setting-item-description"></div>
                            </div>
                            <div className="setting-item-control">
                                <button
                                    className="mod-cta"
                                    onClick={(e) => {
                                        downloadImage(
                                            e,
                                            this.props.chosenImgUrl,
                                            this.state.imgTitle,
                                            this.props.plugin
                                        );
                                        setTimeout(function (e) {
                                            self.props.hide(e);
                                        }, 500);
                                    }}
                                >
                                    Download
                                </button>
                                <div
                                    className="setting-editor-extra-setting-button clickable-icon"
                                    aria-label="Cancel"
                                    tabIndex={0}
                                    onClick={this.props.hide}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}
