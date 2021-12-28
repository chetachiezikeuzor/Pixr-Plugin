import PixrAppError from "./pixrAppError";
import PixrResultList from "./pixrResultList";
import PixrPaginate from "./pixrPaginate";
import React, { Component } from "react";
import { LOAD_STATE, UNSPLASH } from "../util/constants";

export default class PixrApp extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.fetchPhotos = this.fetchPhotos.bind(this);
        this.state = {
            photos: [],
            randPhoto: [],
            totalPhotos: 0,
            perPage: 8,
            errCode: null,
            currentPage: 1,
            loadState: LOAD_STATE.LOADING,
            query: "",
        };
    }

    handleChange(e: any) {
        e.preventDefault();
        this.setState({ query: e.target.value });
    }

    componentDidMount() {
        this.fetchPhotos(this.state.currentPage);
    }

    fetchPhotos(page = 1) {
        const { query } = this.state;

        UNSPLASH.search
            .getPhotos({
                query: query,
                page: page,
                perPage: this.state.perPage,
            })
            .then((result) => {
                if (result.type === "success") {
                    this.setState({
                        perPage: 30,
                        query: query,
                        currentPage: page,
                        loadState: LOAD_STATE.SUCCESS,
                        photos: result.response.results,
                        totalPhotos: result.response.total,
                    });
                }
                if (result.errors) {
                    this.setState({
                        loadState: LOAD_STATE.ERROR,
                        errCode: result.errors,
                        errMsg: result.errors,
                    });
                    console.log(result.errors);
                }
                if (result.response.total === 0 && query) {
                    this.setState({
                        loadState: LOAD_STATE.NO_RESULTS,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    loadState: LOAD_STATE.ERROR,
                    errCode: err,
                    errMsg: err,
                });
                console.log(err);
            });

        UNSPLASH.photos
            .getRandom({
                count: 8,
            })
            .then((result) => {
                if (result.type === "success" && !!!query) {
                    this.setState({
                        photos: result.response,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    loadState: LOAD_STATE.ERROR,
                    errCode: err,
                    errMsg: err,
                });
                console.log(err);
            });

        this.setState({ loadState: LOAD_STATE.SCROLLING });
    }

    render() {
        return (
            <>
                <form
                    onSubmit={(e) => {
                        this.fetchPhotos(1);
                        this.setState({
                            loadState: LOAD_STATE.LOADING,
                        });
                        e.preventDefault();
                    }}
                >
                    <input
                        autoFocus={true}
                        type="search"
                        className="pixr-search-input input"
                        placeholder="Search free high-resolution photos"
                        style={{
                            marginBottom: 12,
                            marginTop: -8,
                            width: "100%",
                            height: "2.58em",
                        }}
                        value={this.state.query}
                        onChange={this.handleChange}
                    />
                </form>

                {this.state.loadState === LOAD_STATE.LOADING ? (
                    <div className="pixr-pagination-loader" />
                ) : this.state.loadState === LOAD_STATE.ERROR ||
                  this.state.loadState === LOAD_STATE.NO_RESULTS ? (
                    <PixrAppError status={this.state.loadState} />
                ) : (
                    <PixrResultList
                        data={this.state.photos}
                        update={this.state.loadState === LOAD_STATE.SCROLLING}
                    />
                )}
                <PixrPaginate
                    pageRange={2}
                    current={this.state.currentPage}
                    total={this.state.totalPhotos}
                    perPage={this.state.perPage}
                    onPageChanged={this.fetchPhotos.bind(this)}
                />
            </>
        );
    }
}
