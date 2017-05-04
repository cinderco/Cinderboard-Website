import firebase from 'firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from './NavBar';
import { signOutUser } from '../../actions';

class HomeContainer extends Component {
  state = {
    user: ''
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
        this.setState({ user: user.displayName });
    });
  }

  onButtonClick() {
    this.props.signOutUser();
  }

  render() {
    return (
      <div>
        <NavBar logOut={this.onButtonClick.bind(this)} name={this.state.user} />
        <div className="mainContainer">
          <div className="container" style={{ backgroundColor: 'white', height: '100vh', padding: 0 }}>
            {this.props.children}
          </div>
        </div>
     </div>
    );
  }
}

export default connect(null, { signOutUser })(HomeContainer);
