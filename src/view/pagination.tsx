import React, { Component } from "react";
import { Icon } from "@iconify/react";

export default class Pagination extends Component<any, any> {
    pages() {
        let pages = [];
        for (let i = this.rangeStart(); i <= this.rangeEnd(); i++) {
            pages.push(i);
        }
        return pages;
    }

    rangeStart() {
        let start = this.props.current - this.props.pageRange;
        return start > 0 ? start : 1;
    }

    rangeEnd() {
        let end = this.props.current + this.props.pageRange;
        let totalPages = this.totalPages();
        return end < totalPages ? end : totalPages;
    }

    totalPages() {
        return Math.ceil(this.props.total / this.props.perPage);
    }

    nextPage() {
        return this.props.current + 1;
    }

    prevPage() {
        return this.props.current - 1;
    }

    hasFirst() {
        return this.rangeStart() !== 1;
    }

    hasLast() {
        return this.rangeEnd() < this.totalPages();
    }

    hasPrev() {
        return this.props.current > 1;
    }

    hasNext() {
        return this.props.current < this.totalPages();
    }

    changePage(page: any) {
        this.props.onPageChanged(page);
    }

    render() {
        return (
            <div className="pagination">
                <div className="pagination__left">
                    <a
                        href="#"
                        className={!this.hasPrev() ? "hidden" : ""}
                        onClick={(e) => this.changePage(this.prevPage())}
                    >
                        <Icon
                            width="1.25em"
                            height="1.25em"
                            icon="bx:bx-chevrons-left"
                            style={{ verticalAlign: "middle" }}
                        />
                    </a>
                </div>

                <div className="pagination__mid">
                    <ul>
                        <li className={!this.hasFirst() ? "hidden" : ""}>
                            <a href="#" onClick={(e) => this.changePage(1)}>
                                1
                            </a>
                        </li>
                        <li className={!this.hasFirst() ? "hidden" : ""}>
                            <span style={{ color: "let(--text-faint)" }}>
                                ...
                            </span>
                        </li>
                        {this.pages().map((page, index) => {
                            return (
                                <li key={index}>
                                    <a
                                        href="#"
                                        onClick={(e) => this.changePage(page)}
                                        className={
                                            this.props.current == page
                                                ? "current"
                                                : ""
                                        }
                                    >
                                        {page}
                                    </a>
                                </li>
                            );
                        })}
                        <li className={!this.hasLast() ? "hidden" : ""}>
                            {" "}
                            <span style={{ color: "let(--text-faint)" }}>
                                ...
                            </span>
                        </li>
                        <li className={!this.hasLast() ? "hidden" : ""}>
                            <a
                                href="#"
                                onClick={(e) =>
                                    this.changePage(this.totalPages())
                                }
                            >
                                {this.totalPages()}
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="pagination__right">
                    <a
                        href="#"
                        className={!this.hasNext() ? "hidden" : ""}
                        onClick={(e) => this.changePage(this.nextPage())}
                    >
                        <Icon
                            width="1.25em"
                            height="1.25em"
                            icon="bx:bx-chevrons-right"
                            style={{ verticalAlign: "middle" }}
                        />
                    </a>
                </div>
            </div>
        );
    }
}

//@ts-ignore
Pagination.defaultProps = {
    pageRange: 2,
};
