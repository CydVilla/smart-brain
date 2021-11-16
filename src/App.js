import './App.css';
import Navigation from './components/Navigation'
import ImageLinkForm from './components/ImageLinkForm';
// import FaceRecogition from './components/FaceRecognition'
import Rank from './components/Rank';
import Logo from './Logo/Logo'
import { Component } from 'react';
import Particles from 'react-particles-js';


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}



class App extends Component {
  constructor()  {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  onSubmit = () => {
    console.log('click')
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
                params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        {/* <FaceRecognition/> */}
      </div>
    )
  } 
  
}

export default App;
