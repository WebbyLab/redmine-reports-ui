/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var $ = window.jQuery = require('jquery');
var _ = require('lodash');
require('select2-browserify');
require('../../../node_modules/select2-browserify/select2/select2.css');

require('./Select2.css');

var Select2 = React.createClass({
    propTypes: {
        children: React.PropTypes.array,
        name: React.PropTypes.string,
        data: React.PropTypes.array,
        disabled: React.PropTypes.bool,
        multiple: React.PropTypes.bool,
        defaultValue: React.PropTypes.array,
        onChange: React.PropTypes.func
    },

    getInitialState() {
        return {
            wasDestroyed: false
        };
    },

    componentDidMount() {
        this._createSelect();
        $(this.getDOMNode()).on('change', this._handleChange);
    },

    componentWillUnmount() {
        var $rootNode = $(this.getDOMNode());
        $rootNode.off('change', this._handleChange);
        $rootNode.select2('destroy');
    },

    componentWillReceiveProps(nextProps) {
        // if new props recieved we need to destoy select2 and build it in componentDidUpdate later
        if (!nextProps.defaultValue || !_.isEqual(nextProps.defaultValue, this.props.defaultValue)) {
            $(this.getDOMNode()).select2('destroy');
            this.setState({
                wasDestroyed: true
            });
        }
    },

    componentDidUpdate() {
        if (this.state.wasDestroyed) {
            this._createSelect();
            this.setState({
                wasDestroyed: false
            });
        }
    },

    _handleChange(e) {
        if (this.props.onChange) {
            this.props.onChange(e.val);
        }
    },

    _createSelect() {
        var $rootNode = $(this.getDOMNode());
        $rootNode.select2({
            data: this.props.data,
            containerCssClass: 'Select2',
            multiple: true,
            placeholder: this.props.placeholder || ''
        });

        if (this.props.defaultValue && this.props.defaultValue.length > 0) {
            $rootNode.select2('val', this.props.defaultValue);
        }

        if (this.props.disabled) {
            $rootNode.select2('enable', false);
        }
    },

    getSelectedValue() {
        return $(this.getDOMNode()).val();
    },

    render() {
        return (
            <ul defaultValue={this.props.defaultValue}
                    name={this.props.name}
                    multiple={this.props.multiple}>
                {this.props.children}
            </ul>
        );
    }
});

module.exports = Select2;