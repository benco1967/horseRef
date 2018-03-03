
import React from 'react';
import {SimpleService} from "../../services/simpleService";
import {Roles} from "./roles";

export class RolesHttp extends SimpleService {
  constructor(props) {
    super(props, []);

  }

  render() {
    return (
      <Roles roles={this.state.value} />
    )
  }
}