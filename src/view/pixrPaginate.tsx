import React, { Component } from "react";
import { wait } from "src/util/utils";

export default class PixrPaginate extends Component<any, any> {
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
            <div className="pixr-pagination">
                <div className="pixr-pagination-left">
                    <a
                        href="#"
                        className={
                            !this.hasPrev() ? "pixr-pagination-hidden" : ""
                        }
                        onClick={(e) => this.changePage(this.prevPage())}
                    >
                        <span
                            aria-hidden="true"
                            style={{ display: "table-caption", height: "auto" }}
                        >
                            &larr;
                        </span>
                    </a>
                </div>

                <div className="pixr-pagination-middle">
                    <ul>
                        <li
                            className={
                                !this.hasFirst() ? "pixr-pagination-hidden" : ""
                            }
                        >
                            <a href="#" onClick={(e) => this.changePage(1)}>
                                1
                            </a>
                        </li>
                        <li
                            className={
                                !this.hasFirst() ? "pixr-pagination-hidden" : ""
                            }
                        >
                            <span style={{ color: "var(--text-faint)" }}>
                                ...
                            </span>
                        </li>
                        {this.pages().map((page, index) => {
                            const pager = !this.hasFirst()
                                ? index <= 3
                                : index <= 3 && index !== 0;
                            const pageNumber = pager && (
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

                            return pageNumber;
                        })}
                        <li
                            className={
                                !this.hasLast() ? "pixr-pagination-hidden" : ""
                            }
                        >
                            {" "}
                            <span style={{ color: "var(--text-faint)" }}>
                                ...
                            </span>
                        </li>
                        <li
                            className={
                                !this.hasLast() ? "pixr-pagination-hidden" : ""
                            }
                        >
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

                <div className="pixr-pagination-right">
                    <a
                        href="#"
                        className={
                            !this.hasNext() ? "pixr-pagination-hidden" : ""
                        }
                        onClick={(e) => {
                            wait(50000);
                            this.changePage(this.nextPage());
                        }}
                    >
                        <span
                            aria-hidden="true"
                            style={{ display: "table-caption", height: "auto" }}
                        >
                            &rarr;
                        </span>
                    </a>
                </div>
            </div>
        );
    }
}
