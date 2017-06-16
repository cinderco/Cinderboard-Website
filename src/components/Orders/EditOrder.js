import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker from 'react-day-picker';
import DatePicker from 'react-datepicker';
import { reduxForm, formValueSelector } from 'redux-form';
import { orderUpdate, outgoingCreate, clearForm, outgoingSave, incomingSave } from '../../actions';


const validate = values => {
  console.log('validate!!!');
  const errors = {};
  if (!values.companyName) {
    errors.companyName = '* Please enter a company name';
  }
  if (!values.orderContent) {
    errors.orderContent = '* Please enter order';
  }
  if (!values.orderType) {
    errors.orderType = '* Please choose order type';
  }
  if (!values.date) {
    errors.date = '* Please pick an order date';
  }
  return errors;
};

class EditOrder extends Component {
  state = {
    user: null,
    startDate: moment(),
    focused: false,
    errorMessage: '',
  }

  componentWillMount() {
    this.setState({
      companyName: this.props.order.companyName,
      order: this.props.order.type,
      selectedDate: new Date(),
      date: this.props.order.date,
      type: this.props.order.other
    });

    $(function () {
        $('#datetimepicker2').datetimepicker({
          format: 'MM/DD/YYYY'
        });
    });
  }

  onPressSaveButton() {
    const order = this.props.order;
    const uid = order.uid;
    const { companyName, date, type } = this.state;
    console.log('date', this.state.date);
    const orderContent = this.state.order;
    const newDate = new Date(date);
    const companyNameOld = order.companyName;
    const typeOld = order.type;
    const otherOld = order.other;
    const status = order.status;
    const { createDate, createdBy } = order;

    const changedValues = _.differenceWith(
      [{ companyName }, { type: orderContent }, { other: type }, { newDate }],
      [{ companyName: companyNameOld }, { type: typeOld }, { other: otherOld }, { newDate: date }],
       _.isEqual);

    const changedValuesTwo = () => {
      const changedValuesArr = ['changed '];
      const date1 = new Date(this.props.order.date).toLocaleDateString();
      const date2 = new Date(newDate).toLocaleDateString();

      for (let i = 0; i < changedValues.length; i++) {
        if (Object.keys(changedValues[i])[0] === 'companyName') {
            changedValuesArr.push(`company name from ${companyNameOld} to ${companyName}, `);
        } else if (Object.keys(changedValues[i])[0] === 'type') {
            changedValuesArr.push(`order from ${typeOld} to ${orderContent}, `);
        } else if (Object.keys(changedValues[i])[0] === 'other') {
            changedValuesArr.push(`order type from ${otherOld} to ${type}, `);
        } else if (Object.keys(changedValues[i])[0] === 'newDate') {
            changedValuesArr.push(`order ${otherOld} date from ${date1} to ${date2}`);
        }
      }

      return changedValuesArr;
    };

    const changed = changedValuesTwo();

    this.props.outgoingSave({
      companyName, type: orderContent, newDate, other: type, status, uid, createDate, changed, createdBy
    });


      this.props.setEditOrder();
  }

  changeInputValue(e, label) {
    console.log(e.target.value);
    this.setState({ [label]: e.target.value });
  }

  renderInputField() {
    return (
      <div className="form-group">
        <label htmlFor='Company Name'>Company Name</label>
        <div style={{ marginTop: 0, marginBottom: 20 }}>
          <input placeholder='Company name' type='text' className='form-control' value={this.state.companyName} onChange={(val) => this.changeInputValue(val, 'companyName')} />
        </div>
      </div>
    );
  }

  renderTextAreaField() {
    return (
      <div className="form-group">
        <label htmlFor='Order'>Order</label>
        <div style={{ marginTop: 0, marginBottom: 20 }}>
          <input placeholder='type order here' type='textarea' className='form-control' value={this.state.order} onChange={(val) => this.changeInputValue(val, 'order')} />
        </div>
      </div>
    );
  }

  renderDateField() {
    return (
      <div className="form-group">
        <label htmlFor="Date">Date</label>
        <div className='input-group date' style={{ marginTop: 0, marginBottom: 0 }}>
          <input placeholder="choose a date" type='text' className="form-control" value={this.state.date} onChange={(val) => this.changeInputValue(val, 'date')} />
          <span className="input-group-addon" onClick={() => this.setState({ showCalendar: !this.state.showCalendar })}>
              <i className="fa fa-calendar" aria-hidden="true" />
          </span>
        </div>
      </div>
    );
  }

  renderSelectField() {
    return (
      <div className="form-group">
        <label htmlFor="Type">Type</label>
        <div style={{ marginTop: 0, marginBottom: 20 }}>
          <select className="form-control" value={this.state.type} onChange={(val) => this.changeInputValue(val, 'type')}>
            <option value="Freight">Freight</option>
            <option value="Delivery">Delivery</option>
            <option value="Will Call">Will Call</option>
          </select>
        </div>
      </div>
    );
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleDayClick(day, { selected }) {
    this.setState({
      selectedDate: selected ? undefined : day,
      date: day.toLocaleDateString()
    });
  }

  renderDayPicker() {
    if (this.state.showCalendar) {
      return (
        <DayPicker
          disabledDays={{ daysOfWeek: [0] }}
          selectedDays={this.state.selectedDate}
          onDayClick={this.handleDayClick.bind(this)}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        {this.renderInputField()}
        {this.renderTextAreaField()}
        {this.renderDateField()}
        {this.renderDayPicker()}
        {this.renderSelectField()}

        <button
          className="btn btn-danger"
          style={{ marginTop: 20 }}
          onClick={() => this.onPressSaveButton()}
        >
          Save
        </button>
      </div>
    );
  }
}

EditOrder = reduxForm({
  form: 'editOrder',
  validate
})(EditOrder);

const selector = formValueSelector('selectingFormValues');

EditOrder = connect(
  state => {
    const {
      companyName,
      orderContent,
      orderType,
      date
    } = selector(state, 'companyName', 'orderType', 'orderContent', 'date');

    return {
      companyName,
      orderContent,
      date,
      orderType
    };
  },
  { orderUpdate, outgoingCreate, clearForm, outgoingSave, incomingSave }
)(EditOrder);

export default EditOrder;
