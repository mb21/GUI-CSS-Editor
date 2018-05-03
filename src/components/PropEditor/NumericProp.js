import React from 'react'

export default class NumericProp extends React.Component {
  render() {
    const propName = this.props.propName
        , parseFn = this.props.float ? parseFloat : parseInt
        ;
    return (
      <div>
        <label>{ this.props.label }</label>
        <input type="number"
          value={ this.props.style[propName] || "" }
          onChange={ e => this.props.onChange({ [propName]: parseFn(e.target.value, 10) }) }
        />
      </div>
    )
  }
}
