import Status from '../../../common/models/status'
import React from 'react';
import {StatusService} from "./statusService";
import {SimpleService} from "../../services/simpleService";

export class StatusServiceHttp extends SimpleService {
  constructor(props) {
    super(props, new Status(props.name), "/admin/status");
  }

  render() {
    return (
      <StatusService status={this.state.value}/>
    )
  }
}