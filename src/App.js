import React, {Component} from 'react'
import CommonMark         from 'commonmark'
import ReactRenderer      from 'commonmark-react-renderer'
import jss                from 'jss'
import preset             from 'jss-preset-default'

import PropEditor         from './components/PropEditor/'
import {Deferred, getUniqueId, previewBody} from './utils'
import './App.css'

const parser   = new CommonMark.Parser()
const renderer = new ReactRenderer()
let sheet = null

export default class App extends Component {
  constructor(props) {
    super(props)
    jss.setup(preset())

    this.state = {
      htmlEls: []
    , markdown: '# hi there\n\nhow are we doing today?\n\n> foo quote\n>\n> bar\n\nswell\n\n- foo\n- bar'
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
  getSelectedElType = (el, names) => this.getSelectedElTypeArr(el, names).join(" > ")
  getSelectedElTypeArr = (el, names) => {
    const elType = el.tagName.toLowerCase()
    return elType === "main"
           ? names
           : this.getSelectedElTypeArr(el.parentNode, [elType].concat(names) )
  }
  deselectParents = el => {
    el.style.background = null
    if (el.parentNode && el.tagName.toLowerCase() !== "main") {
      this.deselectParents(el.parentNode)
    }
  }
  deselectEl = e => {
    if (e.target.className === "preview") {
      this.setState({selectedElType: previewBody})
    }
  }
  interactifyEl = (depth, el) => {
    const children = React.Children.map(el.props.children, child =>
      React.isValidElement(child) && child.props
      ? this.interactifyEl(depth + 1, child)
      : child
    )
    const newElRef = getUniqueId("newEl")
        , asideRef = getUniqueId("aside")
        ;
    const elMounted = new Deferred();
    if (typeof el.type === "function") {
      // some of commonmark-react-renderer's elements are functions that first need to be called...
      el = el.type(el.props);
    }
    const eventHandlers = {
      onClick: e => {
        e.stopPropagation();
        elMounted.promise.then(el => {
          if (el && el.tagName) {
            this.setState({selectedElType: this.getSelectedElType(el, []) })
          }
        });
      }
    , onMouseMove: e => {
        // onMouseEnter doesn't fire when you move the cursor from a child to its parent
        e.stopPropagation();
        elMounted.promise.then(el => {
          el.style.background = 'lightgrey';
          this.deselectParents(el.parentNode);
        });
      }
    , onMouseLeave: () => {
        elMounted.promise.then(el => {
          el.style.background = null
        });
      }
    }
    const newEl = React.cloneElement(el, {
      key: newElRef
    , ref: el => {
        if (el) {
          this.refs[asideRef].style.height = el.offsetHeight - 5 + "px"
          elMounted.resolve(el)
        }
      }
    , ...eventHandlers
    }, children);

    return [
      <aside
        key={ asideRef }
        ref={ asideRef }
        style={ {left: 20*depth - 40 } }
        { ...eventHandlers }
        >
      </aside>
    , newEl
    ];
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
            { this.state.htmlEls.map( this.interactifyEl.bind(null, 0) ) }
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
