
import React from 'react';
import {VersionHttp} from "./versionHttp";
import {LicenseHttp} from "./licenseHttp";
import {MainMenu} from "../menu/mainMenu";
import {StatusServiceHttp} from "../status/statusServiceHttp";
import {RolesHttp} from "../roles/rolesHttp";

export class MainPage extends React.Component {

  render() {
    return <div>
      <h1>
        <img src="/ui/assets/favicon.png" alt="" /> <VersionHttp url="/admin/version" name="horseRef" delai={0} />
      </h1>
      <MainMenu/>
      <StatusServiceHttp url="/admin/status" description="Service horseRef"/>
      <LicenseHttp url="/admin/license" delai={0} />
      <RolesHttp url="/admin/roles" delai={0} />
    </div>
  }
}