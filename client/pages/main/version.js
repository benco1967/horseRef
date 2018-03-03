import React from 'react';

export class Version extends React.Component {

  render() {
    return <span>
      {this.props.name} <span style={{fontSize: "80%", color: "grey"}}>{this.props.version} ({this.props.build})</span>
    </span>;
  }
}