import firebase from 'firebase';
import React from 'react';
import { browserHistory } from 'react-router';

const NavBar = (props) => {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid" style={{ backgroundColor: 'black' }}>
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" style={{ color: 'red'}}>Cinder Co.</a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li className="active"><a href="#">Home <span className="sr-only">(current)</span></a></li>
            <li><a href="#">Clients</a></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Orders <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">All</a></li>
                <li><a href="#">Outgoing</a></li>
                <li><a href="#">Incoming</a></li>
                <li><a href="#">Archived</a></li>
              </ul>
            </li>
            <li><a href="#">Messages</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{props.name} <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Manage Users</a></li>
                <li role="separator" className="divider"></li>
                <li><a onClick={() => props.logOut()}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
