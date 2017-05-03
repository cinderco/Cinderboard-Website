import firebase from 'firebase';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser, checkIfLoggedIn } from '../../actions';

const uri = 'https://s3-us-west-1.amazonaws.com/cinderco/cinder_logo.jpg';

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = '* Please enter an email address';
  }
  if (!values.password) {
    errors.password = '* Please enter your password';
  }
  return errors;
};

class LoginForm extends Component {
  state = {
    user: null
  }

  componentWillMount() {
    console.log('in login form', this.state.user);

    firebase.auth().onAuthStateChanged(user => {
        this.setState({ user });
        if (user) {
          browserHistory.push('/orders');
        }
    });
  }

  handleFormSubmit({ email, password }) {
    console.log(email, password);

    this.props.loginUser({ email, password });
  }

  renderAlert() {
    if (this.props.loginMessage) {
      return (
        <div className="alert alert-danger">
          <strong>{this.props.loginMessage}</strong>
        </div>
      );
    }
  }

  renderField({ input, label, type, placeholder, meta: { touched, error } }) {
    return (
      <div className='form-group'>
        <label style={{ color: 'white' }}>{label}</label>
        <div className='form-group' style={{ marginTop: 0, marginBottom: 20 }}>
          <input {...input} placeholder={placeholder} type={type} className='form-control' />
          {touched && error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div style={styles.container}>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} style={styles.formStyle}>
          <img src={uri} style={{ width: '100%', paddingBottom: '50px' }} />
          <Field
            name="email"
            type="text"
            component={this.renderField}
            label="Email"
          />
          <Field
            name="password"
            type="password"
            component={this.renderField}
            label="Password"
          />
          <button action="submit" className="btn btn-danger" style={{ marginBottom: '20px' }}>Sign in</button>
            {this.renderAlert()}
        </form>
      </div>
    );
  }
}

const styles = {
  formStyle: {
    width: '50%',
    backgroundColor: '#0C130C',
    padding: 50,
    borderRadius: 5
  },
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorTextStyle: {
    fontSize: 20,
    color: 'red'
  },
  successTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'green'
  },
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: '#DB2728',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    borderRadius: 5
  }
};

LoginForm = reduxForm({
  form: 'loginForm',
  validate
})(LoginForm);

LoginForm = connect(
  state => {
    return {
      email: state.auth.email,
      password: state.auth.password,
      loginMessage: state.auth.loginMessage,
      loading: state.auth.loading
    };
  },
  { emailChanged, passwordChanged, loginUser, checkIfLoggedIn }
)(LoginForm);

export default LoginForm;
