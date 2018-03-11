
import React from 'react';
import {Led} from '../../components/led';

export class TenantTable extends React.Component {

  renderRow() {
    return this.props.tenants.map(tenant =>
      <tr key="{tenant.id}"><th>{tenant.id}</th><td><Led state="{tenant.enable}" /></td><td>{tenant.texts.description[0].text}</td></tr>
    );
  }
  render() {
    return !this.props.tenants || this.props.tenants.length === 0 ?
      <div>Aucun tenant</div> :
      <table>
        <thead>
        <tr><th>id</th><th>état</th><th>description</th></tr>
        </thead>
        <tbody>
        {this.renderRow()}
        </tbody>
      </table>;
  }
}