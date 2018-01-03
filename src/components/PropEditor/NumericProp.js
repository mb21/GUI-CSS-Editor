import React from 'react'

export default class NumericProp extends React.Component {
  render() {
    const propName = this.props.propName;
    return (
      <div>
        <label>{ this.props.label }</label>
        <input type="number"
          value={ this.props.style[propName] || "" }
          onChange={ e => this.props.onChange({ [propName]: parseInt(e.target.value, 10) }) }
        />
      </div>
    )
  }
}
