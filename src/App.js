import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";
import Navigation from "./components/Navigation";
import ImageLinkForm from "./components/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition";
import Rank from "./components/Rank";
import Signin from "./components/SignIn";
import Register from "./components/Register";
import Logo from "./Logo/Logo";

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
};

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    console.log('App mounted, checking localStorage...');
    const user = window.localStorage.getItem('user');
    console.log('User data from localStorage:', user);
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('Parsed user data:', userData);
        if (userData && userData.id) {
          this.loadUser(userData);
          this.onRouteChange('home');
        } else {
          console.log('Invalid user data in localStorage');
          window.localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        window.localStorage.removeItem('user');
      }
    }
  }

  loadUser = (data) => {
    console.log('Loading user data:', data);
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = (data) => {
    try {
      if (!data.outputs || !data.outputs[0] || !data.outputs[0].data || !data.outputs[0].data.regions || !data.outputs[0].data.regions[0]) {
        throw new Error('No face detected in the image');
      }

      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    } catch (error) {
      console.error('Error calculating face location:', error);
      return null;
    }
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    if (!this.state.input) {
      alert('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(this.state.input);
    } catch (e) {
      alert('Please enter a valid image URL');
      return;
    }

    this.setState({ imageUrl: this.state.input });
    
    fetch('https://immense-mesa-72945.herokuapp.com/imageurl', {
      method: "post",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('user')).token}`
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(response => {
        console.log('Image processing response:', response);
        if (!response.outputs || !response.outputs[0]) {
          throw new Error('No face detected in the image');
        }
        const faceBox = this.calculateFaceLocation(response);
        if (faceBox) {
          this.displayFaceBox(faceBox);
          // Update user entries count
          fetch('https://immense-mesa-72945.herokuapp.com/image', {
            method: "put",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('user')).token}`
            },
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(err => {
              console.error('Error updating entries:', err);
            });
        } else {
          alert('No face detected in the image. Please try another image.');
          this.setState({ box: {} });
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Error processing image. Please make sure the URL is a valid image containing a face.');
        this.setState({ box: {} });
      });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      window.localStorage.removeItem('user');
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
