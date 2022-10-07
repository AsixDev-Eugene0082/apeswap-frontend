/** @jsxImportSource theme-ui */
import React from 'react'
import { Box, Switch } from 'theme-ui'
import { CogIcon, Flex, RunFiatButton, Svg, Text, TooltipBubble, useModal } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import track from 'utils/track'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import MoonPayModal from 'views/Topup/MoonpayModal'
import { styles } from '../styles'
import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
import { TitleText } from '../../ListViewContent/styles'

interface ZapSwitchProps {
  handleZapSwitch?: () => void
  goZap?: boolean
}

const ZapSwitch: React.FC<ZapSwitchProps> = ({ handleZapSwitch, goZap }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const [onPresentModal] = useModal(<MoonPayModal />)
  const [onPresentSettingsModal] = useModal(<SettingsModal zapSettings={goZap} />)

  return (
    <Flex sx={{ margin: '15px 0', justifyContent: 'space-between', alignItems: 'center' }}>
      <Flex>
        <Flex sx={{ marginRight: '5px', alignItems: 'center' }}>
          <Svg icon="ZapIcon" />
        </Flex>
        <Text weight={700} size="16px" sx={{ marginRight: '10px', lineHeight: '18px' }}>
          {t('ZAP')}
        </Text>
        <Box sx={{ width: '50px' }}>
          <Switch checked={goZap} onChange={handleZapSwitch} sx={styles.switchStyles} />
        </Box>
        <TooltipBubble
          placement={'bottomLeft'}
          transformTip="translate(-6%, 2%)"
          body={
            <Flex>
              {t(
                'Zap enables you to convert a single token into an LP token in one transaction. Disable Zap to add liquidity with two tokens.',
              )}
            </Flex>
          }
          width="180px"
        >
          <TitleText lineHeight={0}>
            <Svg color={'grey' as any} icon="question" width="19px" />
          </TitleText>
        </TooltipBubble>
      </Flex>
      <Flex>
        <RunFiatButton
          sx={{ marginRight: '2px', width: '24px' }}
          mini
          t={t}
          runFiat={onPresentModal}
          track={track}
          position="DEX"
          chainId={chainId}
        />
        <CogIcon sx={{ cursor: 'pointer' }} onClick={onPresentSettingsModal} width="24px" />
      </Flex>
    </Flex>
  )
}

export default React.memo(ZapSwitch)
