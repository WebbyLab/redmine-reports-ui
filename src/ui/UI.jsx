/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Header = require('./components/Header.jsx');
var Chart = require('./components/Chart.jsx');

require('./UI.css');

var UI = React.createClass({
    propTypes: {
        pubsub: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            headerData: {}
        };
    },

    handleUserIssueBarClick(issueID) {
        issueID = issueID.replace('#', '');
        if (issueID == 'Other') {
            return;
        }
        this.props.pubsub.publish('selectIssue', issueID);
    },

    render() {
        return (
            <div className='UI'>
                <Header pubsub={this.props.pubsub} data={this.state.headerData} />
                <div className='container'>
                    <div className='starter-template'>
                        <Chart  idName='chart-user-issue'
                                title="Issues by users"
                                pubsub={this.props.pubsub}
                                data={this.state.userIsueChartData}
                                onClick={this.handleUserIssueBarClick} />
                        <Chart  idName='chart-user-activity'
                                title="Activities by users"
                                data={this.state.userActivityChartData}
                                showLegend={true} />
                        <Chart  idName='chart-user-project'
                                title="Projects by users"
                                data={this.state.userProjectChartData}
                                showLegend={true} />
                        <div className="center">
                            <Chart  idName='chart-total-activity'
                                    title="Total activity"
                                    data={this.state.totalActivityChartData}
                                    chartType='DONUT'
                                    showLegend={true} />
                            <Chart  idName='chart-total-projects'
                                    title="Total hours by projects"
                                    data={this.state.totalProjectChartData}
                                    chartType='DONUT'
                                    showLegend={true} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = UI;