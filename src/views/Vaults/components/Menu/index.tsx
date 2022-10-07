import React from 'react'
import { Flex, Select, SelectItem, Text } from '@apeswapfinance/uikit'
import { Checkbox } from '@ape.swap/uikit'
import { ToggleWrapper } from 'components/ListViewMenu/styles'
import MenuTabButtons from 'components/ListViewMenu/MenuTabButtons'
import { ListViewProps } from './types'
import SearchInput from './SearchInput'
import { ClaimAllWrapper, ControlContainer, LabelWrapper, StyledText } from './styles'
import { OPTIONS, TOKEN_OPTIONS } from './constants'
import HarvestAll from '../Actions/HarvestAll'

const VaultMenu: React.FC<ListViewProps> = ({
  onHandleQueryChange,
  onSetSortOption,
  onSetVaultType,
  query,
  activeVaultType,
  activeOption,
  vaults,
  onSetStake,
  stakedOnly,
}) => {
  const vaultPids = vaults.map((vault) => {
    return vault.pid
  })
  return (
    <ControlContainer>
      <LabelWrapper>
        <StyledText bold mr="15px">
          Search
        </StyledText>
        <SearchInput onChange={onHandleQueryChange} value={query} />
      </LabelWrapper>
      <Flex>
        <Select size="sm" width="140px" onChange={(e) => onSetSortOption(e.target.value)} active={activeOption}>
          {OPTIONS.map((option) => {
            return (
              <SelectItem size="sm" value={option.value} key={option.label}>
                <Text>{option.label}</Text>
              </SelectItem>
            )
          })}
        </Select>
      </Flex>
      <Flex>
        <Select size="sm" width="126px" onChange={(e) => onSetVaultType(e.target.value)} active={activeVaultType}>
          {TOKEN_OPTIONS.map((option) => {
            return (
              <SelectItem size="sm" value={option.value} key={option.label}>
                <Text>{option.label}</Text>
              </SelectItem>
            )
          })}
        </Select>
      </Flex>
      <MenuTabButtons />
      <ToggleWrapper onClick={() => onSetStake(!stakedOnly)}>
        <Checkbox checked={stakedOnly} onChange={() => onSetStake(!stakedOnly)} />
        <StyledText> Staked </StyledText>
      </ToggleWrapper>
      <ClaimAllWrapper>
        <HarvestAll pids={vaultPids} />
      </ClaimAllWrapper>
    </ControlContainer>
  )
}

export default React.memo(VaultMenu)
