import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout, uploadKeyThunk, getKeysThunk, addKey, resetApp, resetKeyboard, saveProjectThunk, loadProjectThunk, newProject, loadProject, clearKeys} from '../store'
import Reader from '../utils/reader'
import load from 'audio-loader'
import {KeySelector, LiveView, LiveKey} from './index'
import _ from 'lodash'
import history from '../history'
import isEmpty from '../utils/isempty'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      track: {}
    }

    this.updateTrack = this.updateTrack.bind(this);
  }

  componentDidMount() {
    this.props.handleLoad(this.props.match.params.id);
    this.props.handleGetKeys(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (isEmpty(this.state.track) && !isEmpty(this.props.keyboard.track)){
      console.log('here');
      this.setState({track: this.props.keyboard.track});
    }
  }

  render() {
    const {userId, children, handleUploadKey, isLoggedIn, keyboard, keys, handleResetApp, handleLogOut, handleSave, handleNewClick, handleLoadClick} = this.props

    return (
      <div className="main">
        <div className="heading">
          <h1><i className="fa fa-rocket" aria-hidden="true"></i> Launchpad <span className="live">LIVE</span></h1>
          <Link className="sign-out" to="/" onClick={() => handleLogOut()}><i className="fa fa-sign-out" aria-hidden="true"></i> Sign Out</Link>
        </div>
        <div className="sound-select-wrapper">
          <KeySelector />
        </div>
        <div className="live-view-wrapper">
          <div className="menu">
            <input
                type="file"
                id="files"
                className="file-btn"
                ref="fileInput"
                onChange={event => handleUploadKey(event, userId)}
                multiple
              />
            <button className="menu-btn" onClick={() => this.refs.fileInput.click()}><i className="fa fa-cloud-upload" aria-hidden="true"></i> Upload</button>
            <button className="menu-btn" onClick={() => handleResetApp()}><i className="fa fa-refresh" aria-hidden="true"></i> Reset</button>
            <button className="menu-btn" onClick={() => handleSave(this.state.track)}><i className="fa fa-floppy-o" aria-hidden="true"></i> Save</button>
            <button className="menu-btn" onClick={() => handleLoadClick()}><i className="fa fa-spinner" aria-hidden="true"></i> Load</button>
            <button className="menu-btn" onClick={() => handleNewClick()}><i className="fa fa-plus" aria-hidden="true"></i> New</button>
          </div>
          <LiveView updateTrack={this.updateTrack}/>
        </div>

      </div>
    )
  }

  updateTrack(track) {
    this.setState({track});
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    keyboard: state.keyboard,
    keys: state.keys,
    userId: state.user.id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleUploadKey(event, userId) {
      const sound = event.target.files[0];
      console.log('USER ID:', userId);
      dispatch(uploadKeyThunk(sound, userId))
    },
    handleGetKeys(keyboardId) {
      dispatch(getKeysThunk(keyboardId))
    },
    handleAddKey(key) {
      dispatch(addKey(key))
    },
    handleResetApp() {
      dispatch(resetApp())
      dispatch(resetKeyboard())
    },
    handleLogOut() {
      dispatch(logout())
    },
    handleSave(track) {
      dispatch(saveProjectThunk(track))
    },
    handleLoad(id) {
      dispatch(loadProjectThunk(id))
      dispatch(clearKeys())
    },
    handleNewClick() {
      dispatch(newProject());
      dispatch(clearKeys())
      history.push('/projects');
    },
    handleLoadClick() {
      dispatch(loadProject());
      history.push('/projects');
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))
