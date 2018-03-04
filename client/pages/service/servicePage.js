
import React from 'react';
import {MainMenu} from "../menu/mainMenu";

export class ServicePage extends React.Component {

  render() {
    return <div>
      <h1>
        <img src="/ui/assets/favicon.png" alt="" /> Administration du service
      </h1>
      <MainMenu/>
    </div>
  }
}