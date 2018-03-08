
import React from 'react';
import { Badge } from 'reactstrap';

export  class StatusLabel extends React.Component {

  getColor() {
    switch(this.props.status) {
      case 'ok': return "success";
      case 'error': return "danger";
      case 'undefined': return "secondary";
      case 'unknow':
      case 'warning':
      default:
        return "warning";
    }
  }
  render() {
    return <Badge color={this.getColor()}>{this.props.status}</Badge>;
  }
}