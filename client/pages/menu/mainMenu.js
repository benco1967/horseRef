
import React from 'react';
import { Link } from "react-router-dom";

export  class MainMenu extends React.Component {

  render() {
    return <div className="block simple-block">
      <header>
        Administration du <Link to="/ui/admin/service">service</Link>
        , ou des <Link to="/ui/admin/tenants">tenants</Link>
        , page de <Link to="/ui/admin/status">status</Link>
        , page de <Link to="/ui/test/horses">chevaux test</Link>
      </header>
    </div>
  }
}