import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from './Routes';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
    this.handleLogout = this.handleLogout.bind(this);
  }
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };
  componentDidMount() {
    // check if user is in session
    if (localStorage.getItem('authToken')) {
      this.userHasAuthenticated(true);
      this.setState({ isAuthenticating: false });
    }
  }
  handleLogout() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    axios
      .delete('/v1/session/')
      .then(response => {
        this.userHasAuthenticated(false);
        this.props.history.push('/login');
    })
    .catch(response => {
      if (response.response.data.status === 500){
        this.props.history.push('/login');
      }
    })
  }
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    const role = localStorage.userRole === 'view' ? 'viewer' : 'admin';
    return (
      <div className='App container'>
          {this.state.isAuthenticated && (
            <Navbar fluid collapseOnSelect className='navbar navbar-dark device-nav-bar fixed-top'>
          <Link className='navbar-brand' to='/'>
            My Home Devices
          </Link>
            <NavItem>
              <div>
              <span className='list-group-item person-icon' href='#'>
                <i className='fa fa-user fa-lg' aria-hidden='true'></i>
                </span>
                <label className='text-white role'>{role}</label>
                <button
                  className='btn btn-dark signIn-btn'
                  onClick={this.handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </NavItem>
        </Navbar>
          )}
        <Routes childProps={childProps} />
      </div>
    );
  }
}
export default withRouter(App);
