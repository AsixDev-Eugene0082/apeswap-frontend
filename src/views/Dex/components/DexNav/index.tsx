/** @jsxImportSource theme-ui */
import { Link, useHistory } from 'react-router-dom'
import { CogIcon, Flex, Text, useModal, RunFiatButton } from '@ape.swap/uikit'
import track from 'utils/track'
import { ChainId } from '@ape.swap/sdk'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import MoonPayModal from 'views/Topup/MoonpayModal'
import SettingsModal from '../../../../components/Menu/GlobalSettings/SettingsModal'
import { styles } from './styles'

interface DexNavProps {
  zapSettings?: boolean
}

const DexNav: React.FC<DexNavProps> = ({ zapSettings }) => {
  const { t } = useTranslation()
  const { pathname } = useHistory().location
  const { chainId } = useActiveWeb3React()

  const onLiquidity =
    pathname?.includes('add-liquidity') ||
    pathname?.includes('liquidity') ||
    pathname?.includes('remove') ||
    pathname?.includes('find') ||
    pathname?.includes('zap')

  const [onPresentSettingsModal] = useModal(<SettingsModal zapSettings={zapSettings} />)
  const [onPresentModal] = useModal(<MoonPayModal />)

  return (
    <Flex sx={styles.dexNavContainer}>
      <Flex
        sx={{ ...styles.navLinkContainer, justifyContent: chainId === ChainId.BSC ? 'space-between' : 'flex-start' }}
      >
        <Text
          size="14px"
          sx={{
            ...styles.navLink,
            color: !pathname?.includes('swap') && 'textDisabled',
            mr: chainId === ChainId.BSC ? '0px' : '30px',
          }}
          as={Link}
          to="/swap"
          id="swap-link"
          className="swap"
        >
          {t('Swap')}
        </Text>
        {chainId === ChainId.BSC && (
          <Text
            size="14px"
            sx={{
              ...styles.navLink,
              color: !pathname?.includes('orders') && 'textDisabled',
            }}
            as={Link}
            to="/limit-orders"
            id="orders-link"
            className="orders"
          >
            {t('Orders')}
          </Text>
        )}
        <Text
          size="14px"
          sx={{ ...styles.navLink, color: !onLiquidity && 'textDisabled' }}
          as={Link}
          to="/zap"
          id="liquidity-link"
          className="liquidity"
        >
          {t('Liquidity')}
        </Text>
      </Flex>
      <Flex sx={{ ...styles.navIconContainer }}>
        <RunFiatButton
          sx={{ marginRight: '2px', width: '20px' }}
          mini
          t={t}
          runFiat={onPresentModal}
          track={track}
          position="DEX"
          chainId={chainId}
        />
        <CogIcon sx={{ cursor: 'pointer' }} onClick={onPresentSettingsModal} />
      </Flex>
    </Flex>
  )
}

export default React.memo(DexNav)
