import React from 'react';
import {Version} from "./version";
import VersionClass from "../../../common/models/version";
import {SimpleService} from "../../services/simpleService";

export class VersionHttp extends SimpleService {
  constructor(props) {
    super(props, new VersionClass(props.name), "/admin/version");

  }

  render() {
    return (
      <Version name={this.state.value.name}
               version={this.state.value.version.number}
               build={this.state.value.version.build}/>
    )
  }
}