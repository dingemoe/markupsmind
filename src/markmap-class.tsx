import React, { Component } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';

export default class MarkmapClass extends Component {
  state = {
    value: '',
  };

  private svg: SVGSVGElement;
  private mm: Markmap;
  private ws: WebSocket;

  bindSvg = (el) => {
    this.svg = el;
    this.initializeMarkmap();
  };

  componentDidMount() {
    this.connectWebSocket();
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  connectWebSocket = () => {
    this.ws = new WebSocket('wss://websocket-mindmap.glitch.me/');
    this.ws.onmessage = (event) => {
      let text = event.data.toString();
      this.setState({ value: text });
    };
    this.ws.onclose = () => {
      console.log('WebSocket closed. Attempting to reconnect...');
      setTimeout(this.connectWebSocket, 1000);
    };
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.ws.close();
    };
  };

  componentDidUpdate() {
    this.updateSvg(); // Update SVG on each update
  }

  initializeMarkmap = () => {
    if (this.svg) {
      requestAnimationFrame(() => {
        const rect = this.svg.getBoundingClientRect();
        if (rect.width && rect.height) {
          this.mm = Markmap.create(this.svg);
        }
      });
    }
  };

  updateSvg = () => {
    if (this.mm) {
      const { root } = transformer.transform(this.state.value);
      this.mm.setData(root);
      this.mm.fit();
    }
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value } = this.state;
    return (
      <React.Fragment>
        <div className="flex-1">
          <textarea
            className="w-full h-full hidden border border-gray-400"
            value={value}
            onChange={this.handleChange}
          />
        </div>
        <svg className="flex-1" ref={this.bindSvg} />
      </React.Fragment>
    );
  }
}
