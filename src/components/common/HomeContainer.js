import firebase from 'firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from './NavBar';
import { signOutUser } from '../../actions';
import { browserHistory, Link, history } from 'react-router';

class HomeContainer extends Component {
  state = {
    user: ''
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
	if(user) {

        this.setState({ user: user.displayName });
    	
	} else {

	browserHistory.push("/");
        
	}
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
            {this.props.children}
        </div>
     </div>
    );
  }
}

export default connect(null, { signOutUser })(HomeContainer);
