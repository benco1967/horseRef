
import React from 'react';

export  class MainMenu extends React.Component {

  render() {
    return <div className="block simple-block">
      <header>
        Administration du <a href="/ui/admin/service">service</a>
        , des <a href="/ui/admin/tenants">tenants</a>
        , ou des <a href="/ui/admin/engines">moteurs</a>
      </header>
    </div>
  }
}