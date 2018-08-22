// canvas.js

    import React, { Component } from 'react';
    import { v4 } from 'uuid';
    import './App.css';
    import PropTypes from 'prop-types'

    class Canvas extends Component {
      constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
      }

      isPainting = false;
      // Different stroke styles to be used for user and guest
      userStrokeStyle = '#FFFFFF';
      line = [];
      // v4 creates a unique id for each user. We used this since there's no auth to tell users apart
      userId = v4();
      prevPos = { offsetX: 0, offsetY: 0 };

      onMouseDown({ nativeEvent }) {
        const { offsetX, offsetY } = nativeEvent;
        this.isPainting = true;
        this.prevPos = { offsetX, offsetY };
      }

      onMouseMove({ nativeEvent }) {
        if (this.isPainting) {
          const { offsetX, offsetY } = nativeEvent;
          const offSetData = { offsetX, offsetY };
          // Set the start and stop position of the paint event.
          const positionData = {
            start: { ...this.prevPos },
            stop: { ...offSetData },
          };
          // Add the position to the line array
          this.line = this.line.concat(positionData);
          this.paint(this.prevPos, offSetData, this.userStrokeStyle);
        }
      }
      endPaintEvent() {
        if (this.isPainting) {
          this.isPainting = false;
          this.sendPaintData();
        }
      }
      paint(prevPos, currPos, strokeStyle) {
        const { offsetX, offsetY } = currPos;
        const { offsetX: x, offsetY: y } = prevPos;

        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeStyle;
        // Move the the prevPosition of the mouse
        this.ctx.moveTo(x, y);
        // Draw a line to the current position of the mouse
        this.ctx.lineTo(offsetX, offsetY);
        // Visualize the line using the strokeStyle
        this.ctx.stroke();
        this.prevPos = { offsetX, offsetY };
      }

      async sendPaintData() {
        const body = {
          line: this.line,
          userId: this.userId,
        };
        // We use the native fetch API to make requests to the server
        const req = await fetch('http://localhost:4000/paint', {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        });
        const res = await req.json();
        this.line = [];
      }

      componentDidMount() {
        // Here we set up the properties of the canvas element. 
        this.canvas.width = 256;
        this.canvas.height = 256;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
      }

      clearCanvas({nativeEvent}) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      handleClick({nativeEvent}) {
      console.log('this is:', this);}

      render() {
        return (
          <div classname="lang_trans">
            <canvas
            // We use the ref attribute to get direct access to the canvas element. 
              ref={(ref) => (this.canvas = ref)}
              style={{ background: 'black' }}
              onMouseDown={this.onMouseDown}
              onMouseLeave={this.endPaintEvent}
              onMouseUp={this.endPaintEvent}
              onMouseMove={this.onMouseMove}
            />
            <div>
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
            </div>
        );
      }
    }

    export default Canvas;