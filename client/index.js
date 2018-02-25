
import React from 'react';
import ReactDOM from 'react-dom';


if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

function component(name) {
  const element = document.createElement('div');
  element.id = name;
  element.innerHTML = 'Hello this is horseRef';

  return element;
}


document.body.appendChild(component('root'));

document.body.appendChild(component('second'));

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

