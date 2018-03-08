import React from 'react';

export class Version extends React.Component {

  render() {
    return <span>
      {this.props.name} <small style={{color: "grey"}}>{this.props.version} ({this.props.build})</small>
    </span>;
  }
}