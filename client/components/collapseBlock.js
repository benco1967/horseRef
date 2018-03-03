
import React from 'react';
import './collapseBlock.css';

export class CollapseBlock extends React.Component {

  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.state = { open: false };
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }
  renderChildren() {
    return this.state.open ? this.props.children : null;
  }
  render() {
    const className = "block collapse" + (this.state.open ? "" : " simple-block");
    return <div className={className}>
      <header>
        <div>{this.props.title}
          <div className="toggle"
                  onClick={this.handleToggle}>
            {this.state.open ? "⏷" : "⏵"}
          </div>
        </div>
      </header>
      {this.renderChildren()}
    </div>;
  }
}