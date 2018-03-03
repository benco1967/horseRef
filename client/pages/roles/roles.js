
import React from 'react';

export class Roles extends React.Component {
  renderDependencies() {
    return (this.props.roles || []).map((role, i) =>
      <li key={i}>
        <strong>{role.id} :</strong> {role.title[0].text}
        <p>{role.summary[0].text}</p>
      </li>);
  }
  render() {
    return <div className="block">
      <header>
        Roles
      </header>
      <ul>
        {this.renderDependencies()}
      </ul>
    </div>;
  }
}
