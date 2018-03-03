
import React from 'react';
import {StatusLabel} from "./statusLabel";

export class StatusDescription extends React.Component {

  render() {
    return <div>{this.props.status.description} <StatusLabel status={this.props.status.status}/></div>;
  }
}