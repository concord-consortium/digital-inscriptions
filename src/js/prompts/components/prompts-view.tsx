import * as React from "react"
import * as queryString from "query-string"
import * as firebase from "firebase"
import {firebaseConfig} from "../../config"
import { v1 as uuid } from "uuid"

interface ActivityListItem {
  name: string
  id: string
}

interface ActivityListMap {
  [key: string]: ActivityListItem
}

// NOTE: this is only a subset of the fields available in the LARA exported JSON
interface ActivityEmbeddable {
  name: string
  hint: string
  prompt: string
  type: string
}
interface ActivityPage {
  name: string
  text: string
  embeddables: ActivityEmbeddable[]
}
interface Activity {
  name: string
  pages: ActivityPage[]
}

export interface EmbeddableProps {
  embeddable: ActivityEmbeddable
  ifNotEmpty: (o:any, key:string, fn:Function) => void
}
export interface EmbeddableState {
  showHint: boolean
}

export class EmbeddableView extends React.Component<EmbeddableProps, EmbeddableState> {
  constructor(props:EmbeddableProps){
    super(props)
    this.toggleHint = this.toggleHint.bind(this)
    this.state = {
      showHint: false
    }
  }

  toggleHint() {
    this.setState({showHint: !this.state.showHint})
  }

  renderHintIcon() {
    const text = this.state.showHint ? "Hide Hint" : "Show Hint"
    return <span className="hint-toggle" onClick={this.toggleHint}>{text}</span>
  }

  renderHint() {
    const {hint} = this.props.embeddable
    if (!hint) {
      return null
    }
    if (this.state.showHint) {
      return (
        <div className="hint">
          { this.renderHintIcon() }
          <span dangerouslySetInnerHTML={{__html: hint}} />
        </div>
      )
    }
    return <div className="hidden-hint">{this.renderHintIcon()}</div>
  }

  render() {
    const {embeddable} = this.props
    return (
      <div className="activity-embeddable">
        {this.props.ifNotEmpty(embeddable, "name", () => <h2>{embeddable.name}</h2>)}
        {this.props.ifNotEmpty(embeddable, "prompt", () => <p dangerouslySetInnerHTML={{__html: embeddable.prompt}}></p>)}
        {this.renderHint()}
      </div>
    )
  }
}

export interface ActivityListItemProps {
  item: ActivityListItem
  handleUpdate: (item: ActivityListItem) => void
  handleDelete: (item: ActivityListItem) => void
}
export interface ActivityListItemState {}

export class ActivityListItemView extends React.Component<ActivityListItemProps, ActivityListItemState> {
  constructor(props:ActivityListItemProps){
    super(props)
  }

  render() {
    const { item } = this.props
    const href = `#activity=${item.id}`
    return (
      <tr>
        <td><a href={href}>{item.name}</a></td>
        <td className="buttons">
          <button onClick={() => this.props.handleUpdate(this.props.item)}>Update</button>
          <button onClick={() => this.props.handleDelete(this.props.item)}>Delete</button>
        </td>
      </tr>
    )
  }
}

export interface PromptsViewProps {}

export interface PromptsViewState {
  updateActivity: ActivityListItem|null
  activityId: string|null
  activity: Activity|null
  activitiesList: ActivityListMap
  importError: string|null
  activityError: string|null
  currentPage: ActivityPage|null
}

export class PromptsView extends React.Component<PromptsViewProps, PromptsViewState> {
  activityListRef: firebase.database.Reference

  constructor(props:PromptsViewProps){
    super(props)

    this.parseHash = this.parseHash.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

    this.state = {
      updateActivity: null,
      activityId: null,
      activity: null,
      activitiesList: {},
      importError: null,
      activityError: null,
      currentPage: null
    }
  }

  refs: {
    url: HTMLInputElement
  }

  componentWillMount() {
    firebase.initializeApp(firebaseConfig)

    this.activityListRef = this.getRef("activityList")
    this.activityListRef.on("value", (snapshot) => {
      let activitiesList:ActivityListMap|null = snapshot ? snapshot.val() : null
      if (activitiesList === null) {
        activitiesList = {}
      }
      this.setState({activitiesList})
    })

    this.parseHash()
    window.addEventListener("hashchange", this.parseHash)
  }

  getRefKey(suffix:string) {
    return `prompts/${suffix}`
  }

  getRef(suffix:string):firebase.database.Reference {
    return firebase.database().ref(this.getRefKey(suffix))
  }

  getActivityKey(activityId:string) {
    return this.getRefKey(`activity/${activityId}`)
  }

  getActivityRef(activityId:string) {
    return firebase.database().ref(this.getActivityKey(activityId))
  }

  parseHash() {
    const params = queryString.parse(window.location.hash)
    this.setState({activityId: params.activity || null, activity: null, activityError: null})
    if (params.activity) {
      this.getActivityRef(params.activity).once("value", (snapshot) => {
        const activity:Activity|null = snapshot.val()
        if (activity === null) {
          this.setState({activityError: `Unknown activity: ${params.activity}`})
        }
        else {
          this.setState({activity, currentPage: activity.pages[0]})
        }
      })
    }
  }

  renderAccordian(activity:Activity) {
    return (
      <div className="accordian">
        {activity.pages.map((page, index) => {
          const className = `accordian-item ${page === this.state.currentPage ? "accordian-item-selected" : ""}`
          return <div key={index} className={className} onClick={() => this.setState({currentPage: page})}>{page.name}</div>
        })}
      </div>
    )
  }

  renderPage(page:ActivityPage) {
    return (
      <div className="page">
        {this.ifNotEmpty(page, "name", () => <h2>{page.name}</h2>)}
        {this.ifNotEmpty(page, "text", () => <p dangerouslySetInnerHTML={{__html: page.text}}></p>)}
        {this.ifNotEmpty(page, "embeddables", () => page.embeddables.map((embeddable, index) => <EmbeddableView key={index} embeddable={embeddable} ifNotEmpty={this.ifNotEmpty} />))}
      </div>
    )
  }

  renderActivity() {
    const {activity, currentPage} = this.state
    if (!activity || !currentPage) {
      return <div className="loading">Loading...</div>
    }

    return (
      <div className="activity">
        {this.renderAccordian(activity)}
        {this.renderPage(currentPage)}
      </div>
    )
  }

  ifNotEmpty(o:any, key:string, fn:Function) {
    if (o && o.hasOwnProperty(key) && o[key]) {
      return fn()
    }
    return null
  }

  handleUpdate(item:ActivityListItem) {
    this.setState({updateActivity: item})
  }

  updateItem(currentItem:ActivityListItem, newItem:ActivityListItem|null, newActivity:Activity|null) {
    const firebaseId = Object.keys(this.state.activitiesList).find((key) => this.state.activitiesList[key].id === currentItem.id)
    if (firebaseId) {
      const updates:any = {}
      updates[firebaseId] = newItem
      this.activityListRef.update(updates)
      this.getActivityRef(currentItem.id).set(newActivity)
    }
}

  handleDelete(item:ActivityListItem) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      this.updateItem(item, null, null)
    }
  }

  renderActivityList() {
    const keys = Object.keys(this.state.activitiesList)
    if (keys.length === 0) {
      return null
    }

    return (
      <div className="activity-list">
        <table>
          <tbody>
            {keys.map((key) => {
              const item = this.state.activitiesList[key]
              return <ActivityListItemView key={item.id} item={item} handleDelete={this.handleDelete} handleUpdate={this.handleUpdate} />
            })}
          </tbody>
        </table>
      </div>
    )
  }

  renderImportError() {
    if (this.state.importError === null) {
      return null
    }
    return <div className="import-error">{this.state.importError}</div>
  }

  handleDragOver(e:React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  handleDrop(e:React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      this.setState({importError: null})
      const reader = new FileReader()
      reader.addEventListener("load", (file) => {
        try {
          const activity:Activity = JSON.parse(reader.result)
          if (activity && activity.hasOwnProperty("name")) {
            if (this.state.updateActivity) {
              this.updateItem(this.state.updateActivity, {name: activity.name, id: this.state.updateActivity.id}, activity)
              this.setState({updateActivity: null})
            }
            else {
              const id = uuid()
              this.getActivityRef(id).set(activity)
              const item: ActivityListItem = {name: activity.name, id}
              const itemRef = this.activityListRef.push(item)
            }
          }
          else {
            this.setState({importError: "This does not look like an exported activity (it is missing the name)"})
          }
        }
        catch (e) {
          this.setState({importError: e.toString()})
        }
      })
      reader.readAsText(e.dataTransfer.files[0])
    }
  }

  renderImport() {
    const message = this.state.updateActivity ? `Drop the updated LARA activity file to update ${this.state.updateActivity.name}...` : "Drop an exported LARA activity here to import it..."
    return (
      <div className="import-dropzone" onDrop={this.handleDrop} onDragOver={this.handleDragOver}>
        { message }
        { this.renderImportError() }
      </div>
    )
  }

  renderActivityCrud() {
    return (
      <div className="activity-crud">
        <h1>Imported Activities</h1>
        { this.renderImport() }
        { this.state.updateActivity === null ? this.renderActivityList() : null }
      </div>
    )
  }

  render() {
    if (this.state.activityId !== null) {
      return this.renderActivity()
    }
    return this.renderActivityCrud()
  }
}