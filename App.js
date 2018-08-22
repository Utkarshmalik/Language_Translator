// App.js

    import React, { Component, Fragment } from 'react';
    import './App.css';
    import Canvas from './canvas';
    import Dropdown from './Dropdown';
    class App extends Component {
      render() {
        return (
          <Fragment>
            <h2 style={{ textAlign: 'center' }}>Language Translator</h2>
            <div className="main">
              <Dropdown />
              <Canvas >
                <div classname="lang_trans">
                  <h4>Tools</h4>
                  <div>
                   <button onClick={(e) => this.clearCanvas(e)}>
                     Classify
                   </button>
                  </div>
                  <div>
                   <button onClick={(e) => this.handleClick(e)}>
                     Translate
                   </button>
                  </div>
                  <div>
                   <button onClick={(e) => this.handleClick(e)}>
                     Request Help
                    </button>
                  </div>
                </div>
              </Canvas>
            </div>
          </Fragment>
        );
      }
    }
    export default App;