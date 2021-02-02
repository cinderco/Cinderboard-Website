import firebase from 'firebase';
import React from 'react';
import { browserHistory, Link } from 'react-router';

// import CinderLogo from '../../images/cinder_logo.jpg';

const NavBar = (props) => {
  return (
    <nav className="navbar navbar-default" style={{ boxShadow: 'none', border: 0, marginBottom: 0 }}>
      <div className="container-fluid" style={{ backgroundColor: 'black' }}>
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="home"><img src="https://s3-us-west-1.amazonaws.com/cinderco/cinder_icon_vector.png" className="navbar-brand" style={{ height: 50, padding: 10, marginLeft: 40 }} /></Link>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{props.name} <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Manage Users</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="" onClick={() => props.logOut()}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
