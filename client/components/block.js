
import React from 'react';

export class Block extends React.Component {

  renderChildren() {
    return this.state.open ? this.props.children : null;
  }
  render() {
    return <div className="block">
      <header>
        <div>{this.props.title}</div>
      </header>
      {this.props.children}
    </div>;
  }
}