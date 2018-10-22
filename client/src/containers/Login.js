import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Button
} from "react-bootstrap";
import axios from "axios";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    if (localStorage.authToken){
     localStorage.removeItem('authToken');
     localStorage.removeItem('userRole');
    }
    this.state = {
      email: "",
      password: "",
      passwordError: null,
      userNameError: null,
      usernamePwdError: null,
      requiredUserName: false,
      requiredPassword: false
    };
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  validateForm() {
    this.resetErrors();
    const { email, password, passwordError, requiredUserName, requiredPassword } = this.state;
    if (email === "" && password === ""){
      this.setState({
        requiredUserName: true,
        requiredPassword: true
      });
      return false;
    }
    if (password.length < 5) {
      this.setState({
        passwordError: "Please enter at least 5 characters."
      });
      return false;
    }else{
      this.setState({passwordError: null });
      return true;
    }
  }
  resetErrors(){
    this.setState({
      userNameError: null,
      usernamePwdError: null,
      requiredUserName: false,
      requiredPassword: false
    });
  }
  handleSubmit = event => {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    axios
      .post("/v1/session/", {
        username: this.state.email,
        password: this.state.password
      })
      .then(response => {
        const data = response.data;
        this.props.userHasAuthenticated(data.auth);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.role);
        this.props.history.push({
          pathname: "/DeviceList"
        });
      })
      .catch(response => {
        const res = response.response;
        this.resetErrors();
        if (res.status === 404 && res.statusText === "Not Found"){
          this.setState({
            userNameError: "There is no account for the username or email you entered"
          });
        }
        if (res.status === 401 && res.statusText === "Unauthorized"){
          this.setState({
            usernamePwdError: "The username and/or password you provided are incorrect"
          });
        }
        if (!res.data.auth){
          this.props.userHasAuthenticated(false);
        }
      });
  };
  renderError(elm) {
    const { userNameError, passwordError } = this.state;
    if (passwordError && elm === 'password') {
      return <div className="help-block">{passwordError}</div>;
    }
    if (userNameError && elm === 'username') {
      return <div className="help-block">{userNameError}</div>;
    }
    return null;
  }
  errorClass(error) {
    let elm = error ? "has-error" : "";
    return elm;
  }
  render() {
    const { passwordError, userNameError, usernamePwdError, requiredUserName, requiredPassword } = this.state;
    return <div className="container loginWrapper">
{!!this.state.loading && <p>I am loading for {this.state.loading} more seconds</p>}
      <h1 id="headline">My Home Devices</h1>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card rounded">
              <div className="card-header">
                <h3 className="mb-0">Login</h3>
              </div>
              <div className="card-body">
                <Form horizontal onSubmit={this.handleSubmit}>
                  <FormGroup controlId="email">
                    <Col sm={10}>
                      <FormControl className={`form-group ${this.errorClass(userNameError)} inputElm`} autoFocus type="email" autoComplete="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
                      {this.renderError("username")}
                      {requiredUserName &&
                        <span class="message">Required</span>
                      }
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="password" >
                    <Col sm={10}>
                      <FormControl value={this.state.password} className={`form-group ${this.errorClass(passwordError)} inputElm passwordInput`} onChange={this.handleChange} type="password" value={this.state.password} placeholder="Password" />
                      {this.renderError("password")}
                      {requiredPassword &&
                        <span class="message">Required</span>
                      }
                    </Col>
                  </FormGroup>
                  {usernamePwdError &&
                  <div className="alert alert-danger" role="alert">
                    {usernamePwdError}
                  </div>}
                  <FormGroup>
                    <Col smOffset={2} sm={10}>
                      <Button block bsSize="large" className="btn-dark signIn-btn" type="submit" text="Sign In">
                        Sign In
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
}

export default Login;
