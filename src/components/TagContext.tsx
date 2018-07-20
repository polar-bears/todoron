import * as React from 'react'

import { ITag } from '../models'

export interface ITagContext {
  tags: ITag[]
}

const TagContext = React.createContext<ITagContext>({ tags: [] })

export default TagContext
