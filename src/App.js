import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import "./App.css";
import Navigation from "./components/Navigation";
import ImageLinkForm from "./components/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition";
import Rank from "./components/Rank";
import Signin from "./components/Signin";
import Register from "./components/Register";
import Logo from "./Logo/Logo";

const app = new Clarifai.App({
  apiKey: "2867f090fa7946159c8ab650ca5ff341",
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }


loadUser = (data) => {
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  }})
}


  calculateFaceLocation = (data) => {
    const claraifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: claraifaiFace.left_col * width,
      topRow: claraifaiFace.top_row * height,
      rightCol: width - (claraifaiFace.right_col * width),
      bottomRow: height - (claraifaiFace.bottom_row * height)
    }
  };

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        // c0c0ac362b03416da06ab3fa36fb58e3
        this.state.input)
      .then(response => {
        // console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
    }

  onRouteChange = (route) => {
    console.log(route)
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, route , box} = this.state; 
    return (
      <div className="App">
        <Particles className="particles" 
        params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
         ?  <div>
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
       : (
         route === 'signin'
        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
      }
      </div>
    )
  }
}

export default App;
