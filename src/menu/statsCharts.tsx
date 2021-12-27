import Chart from "chart.js";
import moment from "moment";
import React, { Component } from "react";
import { UNSPLASH } from "src/util/constants";
import { unformatDate, abbreviateNumber } from "src/util/utils";

export default class StatsCharts extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            photoDownloads: null,
            photoViews: null,
            photoLikes: null,
        };
    }

    chartRef = React.createRef<HTMLCanvasElement>();

    async componentDidMount() {
        let i = 0;
        let date = new Date();
        let likes: number[] = [];
        let views: number[] = [];
        let labels: string[] = [];
        let downloads: number[] = [];
        const startOfWeek = moment().startOf("week");
        const startDate = new Date(startOfWeek as any);
        const ctx = this.chartRef.current.getContext("2d");

        for (i = 3; i >= 1; i--) {
            (date as any) = moment(startDate)
                .subtract(i, "weeks")
                .format("YYYY-MM-DD");
            labels.push(date.toString());
        }

        await UNSPLASH.photos
            .getStats({
                photoId: this.props.photo.id,
            })
            .then((result) => {
                if (result.type === "success") {
                    let getDownloads =
                        result.response.downloads.historical.values.map(
                            (item: any) => {
                                if (labels.includes(item.date))
                                    downloads.push(item.value);
                            }
                        );

                    let getViews = result.response.views.historical.values.map(
                        (item: any) => {
                            if (labels.includes(item.date))
                                views.push(item.value);
                        }
                    );

                    //@ts-ignore
                    let getLikes = result.response.likes.historical.values.map(
                        (item: any) => {
                            if (labels.includes(item.date))
                                likes.push(item.value);
                        }
                    );

                    this.setState({
                        photoDownloads: getDownloads,
                        photoViews: getViews,
                        photoLikes: getLikes,
                    });
                }
            });
        new Chart.Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        data: views,
                        label: "Views",
                        borderColor: "#ADCCFF",
                        backgroundColor: "#ADCCFF52",
                        borderWidth: 1,
                        fill: true,
                        tension: 0.3,
                    },
                    {
                        data: likes,
                        label: "Likes",
                        borderColor: "#FFB8EB",
                        backgroundColor: "#FFB8EB52",
                        borderWidth: 1,
                        fill: true,
                        tension: 0.3,
                    },
                    {
                        data: downloads,
                        label: "Downloads",
                        borderColor: "#9CF09C",
                        backgroundColor: "#9CF09C52",
                        borderWidth: 1,
                        fill: true,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                onHover: function (e: any) {
                    let point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = "pointer";
                    else e.target.style.cursor = "default";
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                legend: {
                    display: false,
                    position: "top",
                    maxSize: {
                        height: 10,
                    },
                    labels: {
                        usePointStyle: true,
                    },
                },
                interaction: {
                    mode: "nearest",
                    intersect: false,
                    axis: "x",
                },
                scales: {
                    //@ts-ignore
                    xAxes: [
                        {
                            ticks: {
                                callback: function (label: any) {
                                    return unformatDate(label);
                                },
                            },
                        },
                    ],
                    //@ts-ignore
                    yAxes: [
                        {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 5,
                                beginAtZero: true,
                                callback: function (label: any) {
                                    return abbreviateNumber(label);
                                },
                            },
                        },
                    ],
                },
                plugin: {},
            },
        });
    }

    render() {
        return (
            <div
                style={{
                    padding: ".5rem 0 .3rem",
                    overflow: "hidden",
                    overflowY: "scroll",
                }}
            >
                <canvas
                    id="pixr-stats-chart"
                    ref={this.chartRef}
                    style={{
                        height: "auto",
                        maxWidth: "9.6rem",
                    }}
                />
            </div>
        );
    }
}
