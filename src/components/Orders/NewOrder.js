import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { orderUpdate, outgoingCreate, clearForm } from '../../actions';

const renderInputField = ({ input, label, type, placeholder, meta: { touched, error } }) => (
  <div className={`form-group has-feedback ${touched && error ? 'has-error' : ''}`}>
    <label htmlFor={label}>{label}</label>
    <div style={{ marginTop: 0, marginBottom: 20 }}>
      <input {...input} placeholder={placeholder} type={type} className='form-control' />
      {touched && error && <span className='help-block'>{error}</span>}
    </div>
  </div>
);

const renderTextAreaField = ({ input, label, placeholder, meta: { touched, error } }) => (
  <div className={`form-group has-feedback ${touched && error ? 'has-error' : ''}`}>
    <label htmlFor={label}>{label}</label>
    <div style={{ marginTop: 0, marginBottom: 20 }}>
      <textarea {...input} placeholder={placeholder} className="form-control" />
      {touched && error && <span className='help-block'>{error}</span>}
    </div>
  </div>
);

const renderDateField = ({ input, label, type, placeholder, meta: { touched, error } }) => (
  <div className={`form-group has-feedback ${touched && error ? 'has-error' : ''}`}>
    <label htmlFor={label}>{label}</label>
    <div className='input-group date' id='datetimepicker1' style={{ marginTop: 0, marginBottom: 0 }}>
      <input {...input} placeholder={placeholder} type={type} className="form-control" />
      <span className="input-group-addon">
          <i className="fa fa-calendar" aria-hidden="true" />
      </span>
    </div>
    {touched && error && <span className='help-block'>{error}</span>}
  </div>
);

const renderSelectField = ({ input, label, meta: { touched, error }, children }) => (
  <div className={`form-group has-feedback ${touched && error ? 'has-error' : ''}`}>
    <label htmlFor={label}>{label}</label>
    <div style={{ marginTop: 0, marginBottom: 20 }}>
      <select {...input} className="form-control">
        {children}
      </select>
      {touched && error && <span className='help-block'>{error}</span>}
    </div>
  </div>
);

const validate = values => {
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
  return errors;
};

class NewOrder extends Component {
  state = {
    user: null,
    startDate: moment(),
    focused: false,
    errorMessage: ''
  }

  componentWillMount() {
    $(function () {
        $('#datetimepicker1').datetimepicker({
          format: 'MM/DD/YYYY'
        });
    });
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleFormSubmit({ companyName, orderContent, orderType, date }) {
    console.log(companyName, orderContent, orderType, 'DATE:', date);
      if (date === undefined) {
        const newDate = 'Unknown';
        this.props.outgoingCreate({ companyName, type: orderContent, newDate, other: orderType });
        $(function () {
          $('#myModal').modal('toggle');
        });

        this.props.reset();
      } else {
        const newDate = new Date(date);
        this.props.outgoingCreate({ companyName, type: orderContent, newDate, other: orderType });
        $(function () {
          $('#myModal').modal('toggle');
        });

        this.props.reset();
      }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
      <button
        type="button"
        className="btn btn-secondary"
        data-toggle="modal"
        data-target="#myModal"
        style={{ marginRight: '15px' }}
      >
        <span><i className="fa fa-plus" aria-hidden="true" /> New Order</span>
      </button>
        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => this.props.reset()}
                  style={{ fontSize: '30px' }}
                >
                  &times;
                </button>
                <h3 className="modal-title">New Order</h3>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                  style={{ padding: '25px', textAlign: 'left' }}
                >
                    <Field
                      name="companyName"
                      type="text"
                      className="form-control form-control-danger"
                      component={renderInputField}
                      label="Company Name"
                    />

                    <Field
                      name="orderContent"
                      type="textarea"
                      className="form-control"
                      placeholder="e.g Silica 420"
                      component={renderTextAreaField}
                      label="Order"
                    />

                    <Field
                      name="orderType"
                      component={renderSelectField}
                      className="form-control"
                      label="Type"
                    >
                      <option />
                      <option value="Freight">Freight</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Will Call">Will Call</option>
                    </Field>

                    <Field
                      name="date"
                      component={renderDateField}
                      type="text"
                      placeholder="choose order date"
                      label="Date"
                    />

                  <button
                    type="submit"
                    className="btn btn-danger"
                    style={{ marginTop: 20 }}
                  >
                    Submit
                  </button>
                </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

NewOrder = reduxForm({
  form: 'newOrder',
  validate
})(NewOrder);

const selector = formValueSelector('selectingFormValues');

NewOrder = connect(
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
  { orderUpdate, outgoingCreate, clearForm }
)(NewOrder);

export default NewOrder;
