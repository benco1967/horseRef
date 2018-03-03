
import React from 'react';
import './statusLabel.css';

export  class StatusLabel extends React.Component {

  getClass() {
    switch(this.props.status) {
      case 'ok':
      case 'error':
      case 'undefined':
      case 'unknow':
      case 'warning':
        return 'status-label ' + this.props.status;
      default:
        return 'status-label unknow';
    }
  }
  render() {
    return <span className={this.getClass()}>{this.props.status}</span>;
  }
}