
import React from 'react';
import {StatusDescription} from "./statusDescription";

export class StatusService extends React.Component {

  renderDependencies() {
    return this.props.status.dependencies.map((dependency, i) => <li key={i}><StatusDescription status={dependency}/></li>);
  }
  render() {
    return <div className="block">
      <header>
        <StatusDescription status={this.props.status}/>
      </header>
      <ul>
        {this.renderDependencies()}
      </ul>
    </div>;
  }
}
