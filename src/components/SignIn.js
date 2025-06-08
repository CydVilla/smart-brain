import React from "react";
import validator from 'validator';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      isLoading: false,
      errors: {
        email: '',
        password: ''
      }
    }
  }

  validateForm = () => {
    const { signInEmail, signInPassword } = this.state;
    const errors = {
      email: '',
      password: ''
    };
    let isValid = true;

    if (!signInEmail.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validator.isEmail(signInEmail)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!signInPassword) {
      errors.password = 'Password is required';
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value })
  }

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value })
  }

  onSubmitSignIn = () => {
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isLoading: true });
    console.log('Attempting to sign in...');

    fetch('https://immense-mesa-72945.herokuapp.com/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        if (data.id) {
          console.log('Sign in successful, storing user data...');
          window.localStorage.setItem('user', JSON.stringify(data));
          this.props.loadUser(data);
          this.props.onRouteChange('home');
        } else {
          console.log('Sign in failed:', data);
          alert('Invalid email or password');
        }
      })
      .catch(err => {
        console.error('Sign in error:', err);
        alert('An error occurred. Please try again.');
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { onRouteChange } = this.props;
    const { errors, isLoading } = this.state;

    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className={`pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 ${errors.email ? 'b--red' : ''}`}
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="red f6 mt1">{errors.email}</p>}
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className={`b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 ${errors.password ? 'b--red' : ''}`}
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="red f6 mt1">{errors.password}</p>}
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value={isLoading ? "Signing in..." : "Sign in"}
                disabled={isLoading}
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;