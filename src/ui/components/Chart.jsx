/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

require('./Chart.css');

module.exports = React.createClass({
    propTypes: {
        idName: React.PropTypes.string.isRequired,
        data: React.PropTypes.array,
        onClick: React.PropTypes.func,
        showLegend: React.PropTypes.bool,
        chartType: React.PropTypes.oneOf(['BAR', 'DONUT'])
    },

    getDefaultProps() {
        return {
            showLegend: false,
            chartType: 'BAR'
        };
    },

    shouldComponentUpdate() {
        return false;
    },

    componentDidMount() {
        this.drawChart(this.props.data);
    },

    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps.data);
    },

    drawChart(data) {
        if (!data) {
            return;
        }

        var drawChartFunc = {
            'BAR': this.drawBarChart,
            'DONUT': this.drawDonutChart
        }[this.props.chartType];

        drawChartFunc(data);
    },

    drawBarChart(data) {
        var self = this;
        nv.addGraph(function() {
            var chart = nv.models.multiBarHorizontalChart()
                .x(function(d) { return d.label; })
                .y(function(d) { return d.value; })
                .margin({ top: 30, right: 20, bottom: 50, left: 175 })
                .tooltips(true) //Show tooltips on hover.
                .showLegend(self.props.showLegend)
                .showValues(true) //Show bar value next to each bar.
                .showBarLabels(true)
                .showControls(false) //Allow user to switch between "Grouped" and "Stacked" mode.
                .stacked(true)
                .transitionDuration(350);

            chart.yAxis
                .tickFormat(d3.format(',.2f'));

            d3.select('#' + self.props.idName + ' svg')
                .datum(data)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        }, function() {
            if (self.props.onClick) {
                d3.selectAll(".nv-bar").on('click', function(e) {
                    self.props.onClick(data[e.series].key);
                });
            }
        });
    },

    drawDonutChart(data) {
        console.log("data:", data);

        var self = this;
        nv.addGraph(function() {
            var chart = nv.models.pieChart()
                .x(function(d) {
                    var hours = Math.round(d.value * 10) / 10;
                    return d.label+' ('+hours+'h)';
                })
                .y(function(d) { return d.value; })
                .margin({ top: 0, right: 0, bottom: 0, left: 0 })
                .showLabels(true) //Display pie labels
                .showLegend(self.props.showLegend)
                .labelThreshold(0.05) //Configure the minimum slice size for labels to show up
                .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                .donut(true) //Turn on Donut mode. Makes pie chart look tasty!
                .donutRatio(0.35); //Configure how big you want the donut hole size to be.

            d3.select('#' + self.props.idName + ' svg')
                .datum(data)
                .call(chart);

            return chart;
        });
    },

    render() {
        return (
            <div className="chart-wrap" id="chart-wrap">
                <h1>{this.props.title}</h1>
                <div id={this.props.idName} ref="chart">
                    <svg></svg>
                </div>
            </div>
        );
    }
});