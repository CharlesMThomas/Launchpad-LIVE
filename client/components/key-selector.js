import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout, uploadKeyThunk, getKeysThunk, addKey, settingKey, removeKeyThunk, unsetKey, saveProjectThunk} from '../store'
import Reader from '../utils/reader'
import load from 'audio-loader'
import {Key} from './index'
import _ from 'lodash'
import ButtonExampleGroupIcon from './buttons/button-group'
import isEmpty from '../utils/isempty'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class SoundSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.keys.length > this.props.keys.length) {
      this.props.handleSaveProjectAfterRemove(this.props.keyboard.track)
    }

    if (!prevProps.keyboard.id && this.props.keyboard.id){
      this.props.handleGetKeys(this.props.keyboard.id);
    } else if (prevProps.keyboard.id !== this.props.keyboard.id){
      this.props.handleGetKeys(this.props.keyboard.id);
    }
  }

  render() {
    const {children, handleUploadKey, isLoggedIn, keyboard, keys, handleSettingKey, app, handleRemoveKey} = this.props

    return (
      <div className="sound-selector">
        <ul>
          {
            !!keys.length ?
            keys.map(key => {
              return (
                <li key={key.id} value={key.id}>
                  <span className="selector-name">{key.name}</span>
                  <button className="remove-btn" onClick={() => handleRemoveKey(key, keyboard)}><i className="fa fa-times" aria-hidden="true"></i></button>
                  <button className={app.setting && app.selected.name === key.name ? "add-btn setting" : "add-btn"} onClick={() => handleSettingKey(key)}><i className="fa fa-plus" aria-hidden="true"></i></button>
                  <button className="preview-btn" onClick={() => this.playPreview(key)}><i className="fa fa-play" aria-hidden="true"></i></button>

                </li>
              )
            }) :
            <p className="get-started">Upload Sounds to get Started!</p>
          }
        </ul>
      </div>
    )
  }

  handlePlayAudio(key) {
    key.audio.play();
  }

  handleStopAudio(key) {
    key.audio.pause();
    key.audio.currentTime = 0;
  }

  handleLowerVolume(key) {
    key.audio.volume -= 0.20
  }

  handleSoundSelect(e) {
    const selected = _.find(this.props.keys, { id: +e });
    this.setState({selected})
  }

  handleAddKeyClick() {
    this.props.handleAddKey(this.state.selected);
  }

  playPreview(key) {
    const audio = new Audio(key.audioURL);
    audio.play();

    setTimeout(() => this.stopPreview(audio), 5000)
  }

  stopPreview(audio) {
    audio.pause();
    audio.currentTime = 0;
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
    app: state.app,
    userId: state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleUploadKey(event) {
      const sound = event.target.files[0];
      dispatch(uploadKeyThunk(sound))
    },
    handleGetKeys(keyboardId) {
      dispatch(getKeysThunk(keyboardId))
    },
    handleAddKey(key) {
      dispatch(addKey(key))
    },
    handleSettingKey(key) {
      dispatch(settingKey(key))
    },
    handleRemoveKey(key, keyboard) {
      dispatch(unsetKey(key, keyboard))
      dispatch(removeKeyThunk(key))
    },
    handleSaveProjectAfterRemove(track) {
      dispatch(saveProjectThunk(track, true))
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(SoundSelector))
