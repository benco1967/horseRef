
import React from 'react';
import './collapseBlock.css';
import {Collapse, Button} from 'reactstrap';

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
    const className = "block" + (this.state.open ? "" : " simple-block");
    return <div className={className}>
      <header className="clearfix">
        <div className="float-left">{this.props.title}</div>
        <Button color="primary" className="float-right" onClick={this.handleToggle} size="sm">
          {this.state.open ? "⏷" : "⏵"}
        </Button>
      </header>
      <Collapse isOpen={this.state.open}>
      {this.renderChildren()}
      </Collapse>





    </div>;
  }
}