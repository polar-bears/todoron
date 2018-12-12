import * as React from 'react'
import SortableJS from 'sortablejs'
import ReactDOM from 'react-dom'

export interface ISortableProps {
  options?: object
  onChange?: Function
  tag?: string | Function,
  style?: object
  ['data-id']?: any
}

export interface ISortableState { }

export interface IStore {
  nextSibling: any
  activeComponent: any
}

const store: IStore = {
  nextSibling: null,
  activeComponent: null,
}

export default class Sortable extends React.Component<ISortableProps, ISortableState> {

  public sortable: any = null

  public componentDidMount () {

    const options: any = { ...this.props.options }

    const evts: string[] = [
      'onChoose',
      'onStart',
      'onEnd',
      'onAdd',
      'onUpdate',
      'onSort',
      'onRemove',
      'onFilter',
      'onMove',
      'onClone',
    ]
    evts.forEach((name: string) => {
      const eventHandler = options[name]

      options[name] = (...params: any) => {
        const [evt] = params

        if (name === 'onChoose') {
          store.nextSibling = evt.item.nextElementSibling
          store.activeComponent = this
        } else if ((name === 'onAdd' || name === 'onUpdate') && this.props.onChange) {
          const items = this.sortable.toArray()
          const remote = store.activeComponent
          const remoteItems = remote.sortable.toArray()

          const referenceNode = (store.nextSibling && store.nextSibling.parentNode !== null) ? store.nextSibling : null
          evt.from.insertBefore(evt.item, referenceNode)
          if (remote !== this) {
            const remoteOptions = remote.props.options || {}

            if ((typeof remoteOptions.group === 'object') && (remoteOptions.group.pull === 'clone')) {
              // Remove the node with the same data-reactid
              evt.item.parentNode.removeChild(evt.item)
            }

            if (remote.props.onChange) {
              remote.props.onChange({
                order: items,
                sortable: this.sortable,
                remoteOrder: remoteItems,
                remoteSortable: remote.sortable,
                evt,
              })
            }
          }

          if (this.props.onChange) {
            this.props.onChange({ order: items, sortable: this.sortable, evt, })
          }
        }

        if (evt.type === 'move') {
          const [evt, originalEvent] = params
          const canMove = eventHandler ? eventHandler(evt, originalEvent) : true
          return canMove
        }

        setTimeout(() => {
          eventHandler && eventHandler(evt)
        }, 0)
      }
    })

    const DomNode: any = ReactDOM.findDOMNode(this)
    this.sortable = SortableJS.create(DomNode, options)
  }

  public componentWillUnmount () {
    if (this.sortable) {
      this.sortable.destroy()
      this.sortable = null
    }
  }

  public render () {

    const { tag = 'div', ...props } = this.props

    const Component: any = tag

    delete props.options
    delete props.onChange

    return (
      <Component {...props} />
    )
  }
}
