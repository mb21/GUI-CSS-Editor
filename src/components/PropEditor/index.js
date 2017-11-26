import React from 'react'

import './PropEditor.css'

export default class PropEditor extends React.Component {

  handleChange = style => {
    this.props.onChangeCb(this.props.selector, style)
  }

  render() {
    return (
      <div className="PropEditor">
        { this.props.selector
          ? <h3>Styling { this.props.selector }</h3>
          : null
        }

        <div className="props">
          <div>
            <label>Font</label>
            <select
              value={ this.props.style.fontFamily || "" }
              onChange={ e => this.handleChange({fontFamily: e.target.value}) }>
              <option value="" disabled></option>
              <option value="sans-serif">Sans-serif</option>
              <option value="serif">Serif</option>
            </select>
          </div>
          <div>
            <label>Font Size</label>
            <input type="number"
              value={ this.props.style.fontSize || "" }
              onChange={ e => this.handleChange({fontSize: parseInt(e.target.value, 10)}) }
            />
          </div>
        </div>

        <code>
          { JSON.stringify(this.props.style) }
        </code>
      </div>
    )
  }
}
