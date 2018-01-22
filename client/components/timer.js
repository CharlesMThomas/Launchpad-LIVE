import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout, uploadKeyThunk, getKeysThunk, setKey, stopSetting, showPlaying, stopPlaying} from '../store'
import Reader from '../utils/reader'
import load from 'audio-loader'
import {Key} from './index'
import _ from 'lodash'

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <input className="track-time" value={this.props.time ? (this.props.time/100) : '0.00'} />
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Timer))
