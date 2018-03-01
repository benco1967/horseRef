
import React from 'react';
import {StatusDescription} from "./statusDescription";
import './statusService.css';

export class StatusService extends React.Component {

  renderDependencies() {
    return this.props.status.dependencies.map(dependency => <li><StatusDescription status={dependency}/></li>);
  }
  render() {
    return <div className="status-block">
      <header>
        <StatusDescription status={this.props.status}/>
      </header>
      <ul>
        {this.renderDependencies()}
      </ul>
    </div>;
  }
}
