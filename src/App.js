import React, {Component} from 'react'
import CommonMark         from 'commonmark'
import ReactRenderer      from 'commonmark-react-renderer'
import jss                from 'jss'
import preset             from 'jss-preset-default'

import PropEditor         from './components/PropEditor/'
import './App.css'

const parser   = new CommonMark.Parser()
const renderer = new ReactRenderer()

const previewBody = "main"

let sheet = null

export default class App extends Component {
  constructor(props) {
    super(props)
    jss.setup(preset())

    this.state = {
      htmlEls: []
    , markdown: '# hi there\n\n how are we doing today?\n\n> foo quote\n>\n> bar\n\nswell :)'
    , selectedElType: previewBody
    , styles: {
        main: {
          fontFamily: 'serif'
        , fontSize: 18
        }
      , h1: {
          fontFamily: 'sans-serif'
        , fontSize: 22
        }
      }
    }
    setTimeout( this.renderMarkdown.bind(null, this.state.markdown ) )
  }
  renderMarkdown = md => {
    const ast = parser.parse(md)
    const els = renderer.render(ast)
    this.setState({ markdown: md, htmlEls: els })
  }
  onCssChange = (selector, style) => {
    let s = { ...this.state.styles}
    s[selector] = { ...s[selector], ...style}
    this.setState({styles: s})
  }
  selectEl = e => {
    const elType = e.target.firstChild.tagName.toLowerCase()
    this.setState({selectedElType: elType})
  }
  deselectEl = e => {
    if (e.target.className === "preview") {
      this.setState({selectedElType: previewBody})
    }
  }
  render() {
    if (sheet) {
      jss.removeStyleSheet(sheet)
    }
    sheet = jss.createStyleSheet({
      '@global': this.state.styles
    }).attach()
    return (
      <div className="App">
        <textarea
          value={this.state.markdown}
          onChange={ e => this.renderMarkdown(e.target.value) }
        />

        <div className="preview" onClick={ this.deselectEl }>
          <main>
            {
            this.state.htmlEls.map( (el, i) =>
              <div key={i} onClick={ this.selectEl }>
                { el }
              </div>
            )
            }
          </main>
        </div>

        <PropEditor
          selector={ this.state.selectedElType }
          style={ this.state.styles[ this.state.selectedElType ] || {} }
          onChangeCb={ this.onCssChange }
          />
      </div>
    );
  }
}
