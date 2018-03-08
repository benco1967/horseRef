import React from 'react';
import { Button } from 'reactstrap';

export class License extends React.Component {

  render() {
    return <div className="block simple-block">
      <header>Licence <Button color="primary" size="sm">ouvrir</Button></header>
    </div>;
  }
}
