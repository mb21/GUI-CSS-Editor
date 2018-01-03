import React from 'react'

import './PropEditor.css'
import NumericProp from './NumericProp'

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
              <option value=""></option>
              <option value="sans-serif">Sans-serif</option>
              <option value="serif">Serif</option>
            </select>
          </div>

          <NumericProp
            label="Font size"
            propName="fontSize"
            style={this.props.style}
            onChange={this.handleChange}
          />

          <NumericProp
            label="Margin top"
            propName="marginTop"
            style={this.props.style}
            onChange={this.handleChange}
          />

          <NumericProp
            label="Margin bottom"
            propName="marginBottom"
            style={this.props.style}
            onChange={this.handleChange}
          />

          <NumericProp
            label="Margin left"
            propName="marginLeft"
            style={this.props.style}
            onChange={this.handleChange}
          />

          <NumericProp
            label="Margin right"
            propName="marginRight"
            style={this.props.style}
            onChange={this.handleChange}
          />
        </div>

        <code>
          { JSON.stringify(this.props.style) }
        </code>
      </div>
    )
  }
}
