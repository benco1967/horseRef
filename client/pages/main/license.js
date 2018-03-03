import React from 'react';

export class License extends React.Component {

  render() {
    return <div className="block simple-block">
      <header>Licence <a className="button" href={this.props.licenseUrl} target="_blank">ouvrir</a></header>
    </div>;
  }
}
