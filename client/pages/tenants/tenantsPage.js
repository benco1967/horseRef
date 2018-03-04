
import React from 'react';
import {MainMenu} from "../menu/mainMenu";

export class TenantsPage extends React.Component {

  render() {
    return <div>
      <h1>
        <img src="/ui/assets/favicon.png" alt="" /> Administration des tenants
      </h1>
      <MainMenu/>
    </div>
  }
}