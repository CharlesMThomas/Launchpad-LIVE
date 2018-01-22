import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout, uploadKeyThunk, getKeysThunk, addKey} from '../store'
import Reader from '../utils/reader'
import load from 'audio-loader'
import {LiveKey, Timer} from './index'
import _ from 'lodash'
import { setTimeout } from 'timers'
import isEmpty from '../utils/isempty'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class LiveView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showVolume: false,
      time: 0,
      status: '',
      track: {}
    }

    this.interval = null;
    this.addToTrack = this.addToTrack.bind(this);
    this.incrementAndPlay = this.incrementAndPlay.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.finishClearing = this.finishClearing.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (isEmpty(this.state.track) && !isEmpty(this.props.keyboard.track)){
      console.log('here');
      this.setState({track: this.props.keyboard.track});
    }
  }

  render() {
    const {keyboard} = this.props
    let recClass = "rec-btn ready";
    let stopClass = "stop-btn ready";
    let rewClass = "rew-btn ready";
    let playClass = "play-btn ready";
    let clearClass = "clear-btn ready";

    if (this.state.status === 'clearing') {
      clearClass = "clear-btn active";
      rewClass = "rew-btn";
      stopClass = "stop-btn";
    }

    if (this.state.status === 'playing') {
      playClass = "play-btn active";
      rewClass = "rew-btn";
      clearClass = "clear-btn";
    }

    if (!this.state.status) {
      stopClass = "stop-btn";
    }

   if (this.state.status === 'recording') {
     playClass = "play-btn";
     recClass = "rec-btn active";
     rewClass = "rew-btn";
     clearClass = "clear-btn";
   }

   if (isEmpty(this.state.track)) {
     playClass = "play-btn";
   }

   if (this.state.time < 10) {
     rewClass = "rew-btn"
   }

    return (
      <div className="live-view">
        <div className="track-buttons-wrapper">
          <button className={playClass} ref="playBtn" onClick={() => this.handlePlay()}><i className="fa fa-play" aria-hidden="true"></i></button>
          <button className={stopClass} onClick={() => this.handleStop()}><i className="fa fa-square" aria-hidden="true"></i></button>
          <button className={rewClass} onClick={() => this.handleRewind()}><i className="fa fa-fast-backward" aria-hidden="true"></i></button>
          <button className={recClass} ref="recBtn" onClick={() => this.handleRecord()}><i className="fa fa-circle" aria-hidden="true"></i></button>
          <Timer time={this.state.time}/>
          <button className={clearClass} ref="clearBtn" onClick={() => this.handleClear()}><i className="fa fa-eraser" aria-hidden="true"></i></button>
        </div>
        {
          keyboard.keys.map(key => {
            return <LiveKey key={key.key} keyInfo={key} valume={this.state.showVolume} status={this.state.status} addToTrack={this.addToTrack} finishClearing={this.finishClearing}/>
          })
        }
      </div>
    )
  }

  addToTrack(key) {
    let updatedTrack = this.state.track;
    let time = this.state.time;

    if (updatedTrack[time]) {
      if (!_.includes(updatedTrack[time], key.key)) {
        updatedTrack[time].push(key.key);
      }
    } else {
      updatedTrack[time] = [key.key]
    }

    this.props.updateTrack(updatedTrack);
    this.setState({track: updatedTrack});
  }

  handleRecord() {
    this.interval = setInterval(this.incrementAndPlay, 10);
    this.refs.recBtn.classList.remove('ready')
    setTimeout(this.startRecording, 100);
  }

  startRecording() {
    this.setState({status: 'recording'});
  }

  handleStop() {
    if (this.state.status === 'recording' || this.state.status === 'playing') {
      clearInterval(this.interval);
      this.setState({status: ''})
    }
  }

  handleRewind() {
    this.setState({time: 0})
  }

  handlePlay() {
    if (!this.state.status && !isEmpty(this.state.track)) {
      this.interval = setInterval(this.incrementAndPlay, 10);
      this.refs.playBtn.classList.remove('ready')
      this.setState({status: 'playing'})
    }
  }

  handleClear() {
    if (this.state.status === '') {
      this.setState({status: 'clearing'})
    } else if (this.state.status === 'clearing') {
      this.setState({status: ''});
    }
  }

  finishClearing() {
    this.setState({status: ''});
  }

  incrementAndPlay() {
    let currentTrack = this.state.track;

    if (currentTrack[this.state.time] && !isEmpty(currentTrack)) {
      currentTrack[this.state.time].forEach(key => {
        document.dispatchEvent(new KeyboardEvent('keydown',{'key': key}));
        document.dispatchEvent(new KeyboardEvent('keyup',{'key': key}));
      })
    }
    this.setState({time: this.state.time + 1});
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
    status: state.app.trackStatus
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
    handleAddKey(key) {
      dispatch(addKey(key))
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(LiveView))
