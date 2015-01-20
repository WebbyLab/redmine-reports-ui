/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var $ = require('jquery');
var moment = require('moment');
window.moment = moment;
require('../../../public/static/js/bower_components/bootstrap-daterangepicker/daterangepicker.js');
require('../../../public/static/js/bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css');

require('./DateRangePicker.css');


var DateRangePicker = React.createClass({
    componentDidMount() {
        var self = this;
        $(this.getDOMNode()).daterangepicker({
            format: 'DD.MM.YYYY',
            startDate: self.props.startDate,
            endDate: self.props.endDate,
            maxDate: moment(),
            opens: 'center',
            buttonClasses:['hide'],
            ranges: {
               'Today': [moment(), moment()],
               'This week': [moment().locale('ru').startOf('week'), moment().locale('ru').endOf('week')],
               'Last week': [moment().locale('ru').startOf('week').subtract(1, 'week'), moment().locale('ru').endOf('week').subtract(1, 'week')],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        })
        .on('hide.daterangepicker', function(ev, picker) {
            self.handleChange(picker);
        });
    },


    componentWillReceiveProps(nextProps) {
        if (nextProps.startDate && nextProps.endDate) {
            var startDate = moment(nextProps.startDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
            var endDate = moment(nextProps.endDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
            var daterangepicker = $(this.getDOMNode()).data('daterangepicker');
            daterangepicker.setStartDate(startDate);
            daterangepicker.setEndDate(endDate);

            this.setState({
                startDate: nextProps.startDate,
                endDate: nextProps.endDate
            });
        }
    },

    componentWillUnmount() {
        $('.daterangepicker').remove();
    },

    handleChange(dateRange) {
        this.setState({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        });
        if (this.props.onChange) {
            this.props.onChange(dateRange);
        }
    },

    render () {
        return (
            <input type='text'
                   placeholder='Select daterange'
                   className='DateRangePicker input-sm form-control'/>
        );
    }
});

module.exports = DateRangePicker;