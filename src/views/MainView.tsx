import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'

import Button from '../components/Button'
import Icon from '../components/Icon'
import SidePanel from '../components/SidePanel'
import TopBar from '../components/TopBar'
import styled from '../styles/styled-components'
import { boardStore } from '../stores'

export interface IProps {}

export default function MainView(props: IProps) {
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addingTitle, setAddingTitle] = useState('')

  const onToggleSidePanel = () => {
    setExpanded(!expanded)
    setAdding(false)
  }

  const { boards, selectedBoard: board } = boardStore

  useEffect(() => {
    if (!boards && !loading) {
      setLoading(true)
      boardStore.listBoards()
    }
    setLoading(false)
  })

  if (loading) return null

  return (
    <Wrapper>
      <TopBar
        header={
          <React.Fragment>
            <Button
              size='large'
              icon={expanded ? 'ArrowLeft' : 'Menu'}
              onClick={onToggleSidePanel}
            />
          </React.Fragment>
        }
      />
      <Container expanded={expanded}>
        hello
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  paddingTop: '60px',
  height: '100%',
  color: theme.fg,
  background: theme.bgLight
}))

const Container = styled.div<{ expanded: boolean }>(({ expanded }) => ({
  paddingLeft: expanded ? '300px' : 0,
  position: 'relative',
  height: '100%',
  transition: 'padding-left 0.3s ease'
}))

const SidePanelTitle = styled.div(() => ({
  flex: 1
}))

const Addition = styled.div<{ visible: boolean }>(({ theme, visible }) => ({
  marginTop: visible ? 0 : '-1px',
  padding: '0 15px',
  display: 'flex',
  alignItems: 'center',
  height: visible ? '36px' : 0,
  borderBottom: theme.border,
  overflow: visible ? 'visible' : 'hidden',
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s ease, height 0.3s ease',
  input: {
    margin: '0 10px',
    flex: 1
  }
}))
