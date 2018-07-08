import { ITag } from '../models'
import * as React from 'react'

export interface ITagContext {
  tags: ITag[]
}

const TagContext = React.createContext<ITagContext>({ tags: [] })

export default TagContext
