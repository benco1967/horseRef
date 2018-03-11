
import React from 'react';
import {MainMenu} from "../menu/mainMenu";

export const HorsesPage = ({match}) => {
  return <div>
        <h1>
          <img src="/ui/assets/favicon.png" alt="" /> Chevaux {match.params.tenant}
        </h1>
        <MainMenu/>
      </div>
};