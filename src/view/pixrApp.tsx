import { unsplash } from "src/util/constants";
import NotFound from "./notFound";
import ResultList from "./resultList";
import Pagination from "./pagination";
import React, { Component } from "react";
import { LOAD_STATE } from "src/util/constants";

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
        this.setState({ loadState: LOAD_STATE.LOADING });
        unsplash.photos
            .getRandom({
                count: 1,
            })
            .then((result) => {
                if (result.type === "success") {
                    this.setState({
                        randPhoto: result.response,
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
            })
            .catch((reason) => {
                console.log(reason);
            });

        unsplash.search
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
                        loadState: LOAD_STATE.ERROR,
                    });
                }
            })
            .catch((reason) => {
                console.log(reason);
            });

        unsplash.photos
            .getRandom({
                count: 8,
            })
            .then((result) => {
                if (result.type === "success" && !!!query) {
                    this.setState({
                        photos: result.response,
                    });
                }
            });
    }

    render() {
        return (
            <>
                <form
                    onSubmit={(e) => {
                        this.setState({
                            loadState: LOAD_STATE.SUBMITTED,
                        });
                        this.fetchPhotos(1);
                        e.preventDefault();
                    }}
                >
                    <input
                        autoFocus={true}
                        type="search"
                        className="search-input input"
                        placeholder="Search free high-resolution photos"
                        style={{
                            marginBottom: 20,
                            width: "100%",
                            height: "2.86em",
                        }}
                        value={this.state.query}
                        onChange={this.handleChange}
                    />
                </form>

                {this.state.loadState === LOAD_STATE.ERROR ? (
                    <NotFound data={this.state.randPhoto} />
                ) : this.state.loadState === LOAD_STATE.SUBMITTED ? (
                    <div className="pagination-loader" />
                ) : (
                    <ResultList
                        data={this.state.photos}
                        update={this.state.loadState === LOAD_STATE.LOADING}
                    />
                )}
                <Pagination
                    current={this.state.currentPage}
                    total={this.state.totalPhotos}
                    perPage={this.state.perPage}
                    onPageChanged={this.fetchPhotos.bind(this)}
                />
            </>
        );
    }
}
