
import React from 'react';
import {CollapseBlock} from "../../components/collapseBlock";

export class Roles extends React.Component {
  renderDependencies() {
    return (this.props.roles || []).map((role, i) =>
      <li key={i}>
        <strong>{role.id} :</strong> {role.title[0].text}
        <p>{role.summary[0].text}</p>
      </li>);
  }
  render() {
    return <CollapseBlock title="Roles">
      <ul>
        {this.renderDependencies()}
      </ul>
    </CollapseBlock>;
  }
}
