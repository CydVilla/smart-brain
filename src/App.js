import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai, {FACE_DETECT_MODEL } from 'clarifai'
import "./App.css";
import Navigation from "./components/Navigation";
import ImageLinkForm from "./components/ImageLinkForm";
import FaceRecognition from './components/FaceRecognition'
import Rank from "./components/Rank";
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
      input: "",
      imageUrl: ''
    };
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    console.log("click");
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(
        function(response) {
          console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
        },
        function(err) {
          // there was an error
        }
        );
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
