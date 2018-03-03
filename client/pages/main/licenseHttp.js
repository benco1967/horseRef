import React from 'react';
import {License} from "./license";
import {SimpleService} from "../../services/simpleService";

export class LicenseHttp extends SimpleService {
  constructor(props) {
    super(props, "");

  }

  retrieveData(xml) {
    const result = /<entry>(?:.|\s)*?<link(?:.|\s)*?rel="license"(?:.|\s)*?href="(.*?)"(?:.|\s)*?\/>/g.exec(xml);
    if(result !== null) {
      this.setState({
        value: result[1],
      });
    }
  }
  render() {
    return (
      <License licenseUrl={this.state.value} />
    )
  }
}