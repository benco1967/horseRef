
import React from 'react';
import {StatusDescription} from "./statusDescription";
import {CollapseBlock} from "../../components/collapseBlock";

export class StatusService extends React.Component {

  renderDependencies() {
    return this.props.status.dependencies.map((dependency, i) => <li key={i}><StatusDescription status={dependency}/></li>);
  }
  render() {
    return <CollapseBlock title={<StatusDescription status={this.props.status}/>} >
      <ul>
        {this.renderDependencies()}
      </ul>
    </CollapseBlock>;
  }
}
