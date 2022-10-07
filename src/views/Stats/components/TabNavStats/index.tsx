import React, { useEffect, useRef, useState } from 'react'
import { Bar, Container, Indicator, StyledTabNavStats, Tab } from './styles'

interface TabNavProps {
  activeTab: string
  onChangeActiveTab: (tab: string) => void
}

const tabOptions = ['Portfolio', 'Analytics', 'NFT']

export const TabNavStats: React.FC<TabNavProps> = ({ activeTab, onChangeActiveTab }) => {
  const [width, setWidth] = useState(0)
  const [left, setLeft] = useState(0)
  const refs = useRef([])

  const handleActiveTab = (el: HTMLDivElement, tab: string) => {
    setLeft(el.offsetLeft)
    setWidth(el.offsetWidth)

    onChangeActiveTab(tab)
  }

  useEffect(() => {
    setLeft(refs.current[1].offsetLeft)
    setWidth(refs.current[1].offsetWidth)
  }, [])

  return (
    <>
      <Container>
        <StyledTabNavStats>
          <Indicator style={{ left, width }} />
          {tabOptions.map((tab, index) => (
            <Tab
              key={tab}
              ref={(element) => {
                refs.current[index] = element
              }}
              onClick={() => handleActiveTab(refs.current[index], tab)}
              isActive={activeTab === tab}
            >
              {tab}
            </Tab>
          ))}
        </StyledTabNavStats>
        <Bar />
      </Container>
    </>
  )
}
