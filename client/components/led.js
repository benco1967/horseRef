import React from 'react';

export class Led extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      borderRadius: '50%',
      width: '1em',
      height: '1em',
      background: this.props.state === undefined ?
        '#333344' :
        (this.props.state ? this.props.colorOn || '#44c340' : this.props.colorOff || '#bf0000'),
      display: 'block'
    };
    return <span className="led" style={style} />;
  }
}