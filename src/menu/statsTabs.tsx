import React, { Component } from "react";
import StatsIcons from "./statsIcons";
import StatsCharts from "./statsCharts";
import StatsDimensions from "./statsDimensions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { unsplash } from "src/util/constants";

export default class MenuTabs extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            photoDownloadsTotal: null,
            photoViewsTotal: null,
            photoLikesTotal: null,
        };
    }
    async componentDidMount() {
        await unsplash.photos
            .getStats({
                photoId: this.props.photo.id,
            })
            .then((result) => {
                if (result.type === "success") {
                    this.setState({
                        photoDownloadsTotal: result.response.downloads.total,
                    });
                    this.setState({
                        photoViewsTotal: result.response.views.total,
                    });
                    this.setState({
                        //@ts-ignore
                        photoLikesTotal: result.response.likes.total,
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
                        views={this.state.photoViewsTotal}
                        downloads={this.state.photoDownloadsTotal}
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
