
import React from 'react';
import ReactDOM from 'react-dom';
import {MainPage} from "./pages/main/mainPage";


if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

ReactDOM.render(
  <div>
    <MainPage/>
  </div>,
  document.getElementById("app")
);
