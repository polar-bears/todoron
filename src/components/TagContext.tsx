import * as React from 'react'

import { ITag } from '../models'

export interface TagContext {
  tags: ITag[]
}

const TagContext = React.createContext<TagContext>({ tags: [] })

export default TagContext
