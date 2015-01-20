/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Q = require('q');
var Moment = require('moment');

var Select2 = require('./Select2.jsx');
var DateRangePicker = require('./DateRangePicker.jsx');
var Button = require('./Button.jsx');

require('./Header.css');

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        pubsub: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            usersData: [],
            projectsData: [],
            defaults: {}
        };
    },

    componentWillMount() {
        this._resolvePromiseAndUpdateState(this.props.data);
    },

    componentWillReceiveProps(nextProps) {
        this._resolvePromiseAndUpdateState(nextProps.data);
    },

    _resolvePromiseAndUpdateState(data) {
        if (!data || !data.userPromise || !data.projectPromise) {
            return;
        }

        var self = this;
        Q([data.userPromise, data.projectPromise]).spread(function(users, projects) {
            self.setState({
                usersData: users,
                projectsData: projects,
                defaults: self.props.data.defaults || {}
            });
        }).catch(function(err) {
            console.error('Header resolvePromise:', err);
        });
    },

    handleSelectChange(name, val) {
        var newState = {};
        newState[name] = val;
        this.setState(newState);
    },

    handleSubmit() {
        this.props.pubsub.publish('filter', {
            users: this.state.selectUsers || this.state.defaults.users,
            projects: this.state.selectProjects || this.state.defaults.projects,
            startDate: this.refs.dateRange.state.startDate ? Moment(this.refs.dateRange.state.startDate).format('YYYY-MM-DD') : undefined,
            endDate: this.refs.dateRange.state.endDate ? Moment(this.refs.dateRange.state.endDate).format('YYYY-MM-DD') : undefined,
        });
    },

    render() {
        var defaults = this.state.defaults || {};

        return (
            <div className="Header navbar navbar-inverse">
              <div className="container">
                <div>
                    <form className="form-inline" role="form">
                        <div className="form-group col-lg-3 col-md-3 col-sm-5">
                            <label className="sr-only" for="exampleInputEmail2">Email address</label>
                            <Select2 ref="users"
                                     data={this.state.usersData}
                                     onChange={this.handleSelectChange.bind(this,'selectUsers')}
                                     defaultValue={defaults.users}
                                     placeholder="Select users" />
                        </div>
                        <div className="form-group col-lg-3 col-md-3 col-sm-5">
                            <div className="input-group">
                                <Select2 ref="projects"
                                         data={this.state.projectsData}
                                         onChange={this.handleSelectChange.bind(this,'selectProjects')}
                                         defaultValue={defaults.projects}
                                         placeholder="Select projects" />
                            </div>
                        </div>

                        <div className="form-group col-lg-5 col-md-5 col-sm-5">
                            <DateRangePicker ref="dateRange" startDate={defaults.startDate} endDate={defaults.endDate} />
                        </div>
                        <div className="form-group col-offset-lg-1 col-lg-1 col-offset-md-1 col-md-1 col-sm-2">
                            <Button onClick={this.handleSubmit} value={'Submit'} />
                        </div>
                    </form>
                </div>
              </div>
            </div>
        );
    }
});