/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var cx = require('react-classset');

var Button = React.createClass({
    propTypes: {
        value: React.PropTypes.string,
        onClick: React.PropTypes.func,
    },

    handleClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    },

    render() {
        var btnClass = cx({
            'Button': true,
            'btn': true,
            'btn-success': true,
        });

        return (
            <button type='button' className={btnClass} onClick={this.handleClick}>
                {this.props.value}
            </button>
        );
    }
});

module.exports = Button;