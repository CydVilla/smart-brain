import React from "react";
import validator from 'validator';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      isLoading: false,
      errors: {
        email: '',
        password: '',
        name: ''
      }
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  validateForm = () => {
    const { email, password, name } = this.state;
    const errors = {
      email: '',
      password: '',
      name: ''
    };
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validator.isEmail(email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (this._isMounted) {
      this.setState({ errors });
    }
    return isValid;
  };

  onNameChange = (event) => {
    if (this._isMounted) {
      this.setState({ name: event.target.value });
    }
  };

  onEmailChange = (event) => {
    if (this._isMounted) {
      this.setState({ email: event.target.value });
    }
  };

  onPasswordChange = (event) => {
    if (this._isMounted) {
      this.setState({ password: event.target.value });
    }
  };

  onSubmitSignIn = () => {
    if (!this.validateForm()) {
      return;
    }

    if (this._isMounted) {
      this.setState({ isLoading: true });
    }
    
    fetch('https://immense-mesa-72945.herokuapp.com/register', {
      method: 'post',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        if (data.id) {
          window.localStorage.setItem('user', JSON.stringify(data));
          this.props.loadUser(data);
          this.props.onRouteChange('home');
        } else {
          alert('Registration failed. Please try again.');
        }
      })
      .catch(err => {
        alert('An error occurred. Please try again.');
        console.error(err);
      })
      .finally(() => {
        if (this._isMounted) {
          this.setState({ isLoading: false });
        }
      });
  }

  render() {
    const { errors, isLoading } = this.state;
    
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className={`pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 ${errors.name ? 'b--red' : ''}`}
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="red f6 mt1">{errors.name}</p>}
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className={`pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 ${errors.email ? 'b--red' : ''}`}
                  type="email"
                  name="email"
                  id="email"
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
                value={isLoading ? "Registering..." : "Register"}
                disabled={isLoading}
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;