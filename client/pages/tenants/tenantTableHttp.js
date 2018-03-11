import React from 'react';
import {TenantTable} from "./tenantTable";
import {SimpleService} from "../../services/simpleService";

export class TenantTableHttp extends SimpleService {
  constructor(props) {
    super(props, [], "/admin/tenants");
  }

  render() {
    return (
      <TenantTable tenants={this.state.value}/>
    )
  }
}