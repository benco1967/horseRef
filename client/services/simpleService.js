
import axios from 'axios';
import React from 'react';

export class SimpleService extends React.Component {
  constructor(props, defaultValue, defaultUrl) {
    super(props);
    this.timerId = null;
    this.defaultUrl = defaultUrl;
    this.defaultValue = defaultValue;
    this.state = {
      value: defaultValue,
    }
  }

  componentDidMount() {
    if(this.props.delai !== 0) {
      this.timerId = setInterval(
        () => this.tick(),
        this.props.delai || 10000
      );
    }
    this.tick();
  }

  retrieveData(data) {
    this.setState({
      value: data,
    });
  }
  tick() {
    axios.get(this.props.url || this.defaultUrl)
      .then(res => {
        this.retrieveData(res.data);
      })
      .catch(err => {
        console.error(err);
        this.setState({
          value: this.defaultValue,
        });
      })
  }

  componentWillUnmount() {
    if(this.timerId !== null) clearInterval(this.timerId);
  }
}