import ResultList from "./resultList";
import Pagination from "./pagination";
import superagent from "superagent";
import { clientID, LOAD_STATE } from "src/util/constants";
import React, { Component } from "react";

const simpleGet = (options: any) => {
    superagent.get(options.url).then(function (res: any) {
        if (options.onSuccess) options.onSuccess(res);
    });
};

export default class MultiPixApp extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.fetchPhotos = this.fetchPhotos.bind(this);
        this.state = {
            photos: [],
            totalPhotos: 0,
            perPage: 30,
            currentPage: 1,
            loadState: LOAD_STATE.LOADING,
            query: "",
        };
    }
    handleChange(e: any) {
        this.setState({ query: e.target.value });
    }

    componentDidMount() {
        this.fetchPhotos(this.state.currentPage);
    }

    fetchPhotos(page = 1) {
        var self = this;
        const { query, perPage } = this.state;
        `https://api.unsplash.com/query/photos?page=1&query=cookie&client_id=8e31e45f4a0e8959d456ba2914723451b8262337f75bcea2e04ae535491df16d&client_id=N1ZIgf1m1v9gZJhledpAOTXqS8HqL2DuiEyXZI9Uhsk&page=1&per_page=30 404`;
        const url1 = `https://api.unsplash.com/photos?page=${page}&client_id=${clientID}`;
        const url2 =
            `https://api.unsplash.com/query/photos?page=${page}&query=` +
            query +
            "&client_id=" +
            clientID;

        const randURL = `https://api.unsplash.com/photos/random/?count=30&page=${page}&client_id=${clientID}`;
        const photosURL = query ? `${randURL}&query=${query}` : randURL;
        const resultURL = `https://api.unsplash.com/search/photos?query=${query}&per_page=30&page=${page}&client_id=${clientID}`;

        const url = query ? url2 : url1;

        this.setState({ loadState: LOAD_STATE.LOADING });
        simpleGet({
            url: photosURL,
            onSuccess: (res: any) => {
                this.setState({
                    photos: res.body,
                    currentPage: page,
                    query: query,
                    loadState: LOAD_STATE.SUCCESS,
                });
            },
        });

        simpleGet({
            url: resultURL,
            onSuccess: (res: any) => {
                this.setState({
                    totalPhotos: parseInt(res.headers["x-total"]),
                });
            },
        });
    }

    render() {
        return (
            <div className="app">
                <form onSubmit={() => this.fetchPhotos(1)}>
                    <input
                        type="search"
                        className="search-input js-search-input input"
                        placeholder="Try 'dogs' or 'coffee'!"
                        style={{
                            marginBottom: 20,
                            width: "100%",
                            height: "2.86em",
                        }}
                        value={this.state.query}
                        onChange={this.handleChange}
                    />
                </form>

                {this.state.loadState === LOAD_STATE.LOADING ? (
                    <div className="loader" />
                ) : (
                    <ResultList data={this.state.photos} />
                )}
                <Pagination
                    current={this.state.currentPage}
                    total={this.state.totalPhotos}
                    perPage={this.state.perPage}
                    onPageChanged={this.fetchPhotos.bind(this)}
                />
            </div>
        );
    }
}
