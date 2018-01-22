import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout, uploadKeyThunk, getKeysThunk, setKey, stopSetting, showPlaying, stopPlaying, unsetSingleKey} from '../store'
import Reader from '../utils/reader'
import load from 'audio-loader'
import {Key} from './index'
import _ from 'lodash'


/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */

class LiveKey extends Component {
  constructor(props) {
    super(props);

    this.state = {}

    this.keyPress = this.keyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPress);
  }

  render() {
    const {keyInfo, volume} = this.props
    let keyClass = ""
    if (keyInfo.status === 'unmounted') {
      keyClass = "live-key unmounted";
    } else if (keyInfo.status === 'mounted') {
      keyClass = "live-key mounted";
    } else if (keyInfo.status === 'playing') {
      keyClass = "live-key playing";
    }

    return (
      <div className="live-key-wrapper">
         <div className={keyClass} ref="keyRef" onClick={() => this.handleKeyClick()}>
          <div>{keyInfo.key}</div>
          {
          keyInfo.audio && volume && <progress value={keyInfo.audio.volume} max="1"></progress>
          }
          <div className="sound-name">{keyInfo.name}</div>
        </div>
      </div>
    )
  }

  keyPress(e) {
    if (e.key === this.props.keyInfo.key && this.props.keyInfo.audio) {
      this.handlePlayAudio(this.props.keyInfo);
    }
  }

  handleKeyClick() {
    if (this.props.status === 'clearing') {
      this.props.handleRemoveKey(this.props.keyInfo, this.props.keyboard);
      this.props.finishClearing();
    } else if(this.props.app.setting) {
      this.props.handleSetKey(this.props.app.selected, this.props.keyInfo);
    } else if (this.props.keyInfo.status === 'mounted' || this.props.keyInfo.status === 'playing') {
      this.handlePlayAudio(this.props.keyInfo);
    }
  }

  handlePlayAudio(key) {
    if (this.props.status === 'recording') {
      console.log("Key", key);
      this.props.addToTrack(key);
    }

    key.audio.currentTime = 0;
    key.audio.play();
    key.audio.addEventListener("ended", function(){
      key.audio.currentTime = 0;
      this.props.handleStopAudio(key);
    }.bind(this));

    if (this.refs.keyRef.classList.contains('mounted')) {
      this.refs.keyRef.classList.remove('mounted');
      this.refs.keyRef.classList.add('unmounted');
      setTimeout(() => this.props.handleShowPlaying(key), 100);
    } else {
      this.refs.keyRef.classList.remove('playing');
      this.refs.keyRef.classList.add('unmounted');
      setTimeout(() => this.refs.keyRef.classList.add('playing'), 100);
    }

  }

  handleLowerVolume(key) {
    key.audio.volume -= 0.20
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
    app: state.app
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleUploadKey(event) {
      const sound = event.target.files[0];
      dispatch(uploadKeyThunk(sound))
    },
    handleGetKeys() {
      dispatch(getKeysThunk())
    },
    handleSetKey(selected, keyInfo) {
      dispatch(setKey(selected, keyInfo))
      dispatch(stopSetting())
    },
    handleShowPlaying(key) {
      dispatch(showPlaying(key))
    },
    handleStopAudio(key) {
      dispatch(stopPlaying(key))
    },
    handleRemoveKey(key, keyboard) {
      dispatch(unsetSingleKey(key, keyboard))
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(LiveKey))
