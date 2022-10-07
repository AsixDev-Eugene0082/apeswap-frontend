import React from 'react'
import { Button, Flex, Link, Select, SelectItem, Text } from '@apeswapfinance/uikit'
import { useTranslation } from 'contexts/Localization'
import { ControlContainer, LabelWrapper, StyledText } from './styles'
import SearchInput from './SearchInput'

interface ListViewProps {
  onHandleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSetSortOption: (value: string) => void
  query: string
  activeOption?: string
}

const displayOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'NFAs',
    value: 'NFA',
  },
  {
    label: 'NFBs',
    value: 'NFB',
  },
  {
    label: 'Bills',
    value: 'Bill',
  },
]

const ListViewMenu: React.FC<ListViewProps> = ({ onHandleQueryChange, onSetSortOption, query, activeOption }) => {
  const { t } = useTranslation()
  return (
    <ControlContainer>
      <LabelWrapper>
        <StyledText bold mr="15px">
          {t('Search')}
        </StyledText>
        <SearchInput onChange={onHandleQueryChange} value={query} />
      </LabelWrapper>
      <Flex alignItems="center" style={{ height: '36px' }}>
        <Select size="sm" width="242px" onChange={(e) => onSetSortOption(e.target.value)} active={activeOption}>
          {displayOptions.map((option) => {
            return (
              <SelectItem key={option.label} size="sm" value={option.value}>
                <Text>{t(option.label)}</Text>
              </SelectItem>
            )
          })}
        </Select>
      </Flex>
      <Link
        href="https://nftkey.app/collections/nfas/"
        target="_blank"
        style={{ textDecoration: 'none', maxWidth: '311px', width: '100%' }}
      >
        <Button style={{ width: '100%', height: '42px' }}>
          <Text bold fontSize="22px" color="primaryBright">
            {t('Marketplace')}
          </Text>
        </Button>
      </Link>
    </ControlContainer>
  )
}

export default React.memo(ListViewMenu)
