import React, {Component} from 'react'
import {connect} from 'react-redux'
import {auth, newProject, loadProject, createProjectThunk, getKeyboardsThunk, setProject} from '../store'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
class Projects extends Component {
  componentDidMount() {
    this.props.handleGetKeyboards();
  }

  render() {
    const {view} = this.props

    return (
      <div className="auth-form">
        <div className="form-wrapper">
          <h1><i className="fa fa-rocket" aria-hidden="true"></i> Launchpad <span className="live">LIVE</span></h1>
          {view === 'menu' && this.renderProjectsButtons()}
          {view === 'new' && this.renderNewProjectForm()}
          {view === 'load' && this.renderLoadProjects()}
        </div>
      </div>
    )
  }

  renderProjectsButtons() {
    const {handleNewProject, handleLoadProject} = this.props

    return (
      <div>
        <button className="project-btn left-margin" onClick={() => handleNewProject()}><i className="fa fa-plus" aria-hidden="true"></i> New Project</button>
        <button className="project-btn" onClick={() => handleLoadProject()} ><i className="fa fa-spinner" aria-hidden="true"></i> Load Project</button>
      </div>
    );
  }

  renderNewProjectForm() {
    const {handleCreateProject} = this.props;

    return (
      <form onSubmit={handleCreateProject}>
        <div>
          <label htmlFor="name"><small>Project Name</small></label>
          <input name="name" type="text" placeholder="Project Name"/>
        </div>
        <button type="submit" className="login-btn"><i className="fa fa-tasks" aria-hidden="true"></i> Create</button>
      </form>
    )
  }

  renderLoadProjects() {
    const {keyboards, handleSetProject, handleNewProject} = this.props;

    return (
      <div>
        <div className="load-project-wrapper">
          <ul>
          {
            !!keyboards.length ?
            keyboards.map(keyboard => {
              return <li onClick={() => handleSetProject(keyboard)}>{keyboard.name}</li>
            }) :
            <li>No Projects Found.</li>
          }
          </ul>
        </div>
        <div className="create-link-wrapper">
          <a onClick={handleNewProject}>Create New Project</a>
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    view: state.app.projectsView,
    keyboards: state.keyboards
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleNewProject() {
      dispatch(newProject())
    },
    handleLoadProject() {
      dispatch(loadProject())
    },
    handleCreateProject (evt) {
      evt.preventDefault()
      const name = evt.target.name.value
      dispatch(createProjectThunk(name))
    },
    handleGetKeyboards() {
      dispatch(getKeyboardsThunk())
    },
    handleSetProject(keyboard) {
      dispatch(setProject(keyboard))
    }
  }
}

export default connect(mapState, mapDispatch)(Projects)
