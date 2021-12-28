import React, { Component } from "react";
import StatsIcons from "./statsIcons";
import StatsCharts from "./statsCharts";
import { UNSPLASH } from "src/util/constants";
import StatsDimensions from "./statsDimensions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export default class MenuTabs extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            downloadsTotal: null,
            viewsTotal: null,
            likesTotal: null,
        };
    }
    async componentDidMount() {
        await UNSPLASH.photos
            .getStats({
                photoId: this.props.photo.id,
            })
            .then((result) => {
                if (result.type === "success") {
                    this.setState({
                        downloadsTotal: result.response.downloads.total,
                    });
                    this.setState({
                        viewsTotal: result.response.views.total,
                    });
                    this.setState({
                        //@ts-ignore
                        likesTotal: result.response.likes.total,
                    });
                }
            });
    }
    render() {
        return (
            <Tabs>
                <TabList>
                    <Tab>Info</Tab>
                    <Tab>DIM</Tab>
                    <Tab>Stats</Tab>
                </TabList>
                <TabPanel>
                    <StatsIcons
                        likes={this.props.photo.likes}
                        views={this.state.viewsTotal}
                        downloads={this.state.downloadsTotal}
                        size={this.props.blob.size}
                    />
                </TabPanel>
                <TabPanel>
                    <StatsDimensions
                        photo={this.props.photo}
                        dimensions={this.props.dimensions}
                    />
                </TabPanel>
                <TabPanel>
                    <StatsCharts photo={this.props.photo} />
                </TabPanel>
            </Tabs>
        );
    }
}
