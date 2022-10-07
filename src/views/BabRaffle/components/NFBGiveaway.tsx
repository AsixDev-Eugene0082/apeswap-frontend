/** @jsxImportSource theme-ui */
import { Button, Flex, Link, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import ReactPlayer from 'react-player'
import { useFetchBabToken, useWonRaffles } from 'state/hooks'
import { styles } from '../styles'

const BabInfoCard: React.FC = () => {
  const { t } = useTranslation()
  const { holdsBab } = useFetchBabToken()
  const {
    claim: claimWin,
    claiming: winClaiming,
    userWins,
    userWon: wonPrize,
    userClaimed: hasClaimed,
  } = useWonRaffles()
  const { account } = useActiveWeb3React()

  const nfbNumber = userWins[0]?.prizeTokenId

  // wonPrize
  // -> Congratulations Text, New Description with NFB #number

  // wonPrize
  // -> !hasClaimed -> Claim NFB button
  // -> hasClaimed (wonPrize also true) -> Claimed button (disabled)

  return (
    <Flex sx={styles.nfb}>
      <Flex sx={styles.nfbCon}>
        <Flex sx={styles.nfbTextCon}>
          <Text sx={styles.nfbHeader}>
            {!holdsBab
              ? t('The 30-Day ApeSwap BAB NFB Raffle')
              : wonPrize && account
              ? t("Congratulations, You've Won!")
              : t('You are not a winner... yet! Check back tomorrow.')}
          </Text>
          <Text sx={styles.nfbDescription}>
            {wonPrize && account && (
              <Text sx={{ fontWeight: 700, margin: 0, lineHeight: 0 }}>
                {t(`NFB #${nfbNumber} is ready to be in your wallet!`)}
                <br />
                <br />
              </Text>
            )}
            {wonPrize && account
              ? t('Thank you for joining the ApeSwap BAB Club and participating in our BAB Launch Raffle!')
              : t(
                  `From October 1st through October 31st, all holders of an ApeSwap BAB NFT will be eligible to participate in a daily raffle to win a Non Fungible Banana NFT.`,
                )}
            <br />
            <br />
            {wonPrize && account
              ? t('Look forward to more BAB token initiatives in the future.')
              : t(`Make sure to return to this page daily in October to see if you have won an NFB!`)}
          </Text>
          <Text sx={styles.nfbBottom}>
            {holdsBab && wonPrize && account ? (
              <>
                {hasClaimed ? (
                  <Button disabled sx={{ width: ['100%', '300px', '388px'] }}>
                    {t('Claimed')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => claimWin(userWins[0].id)}
                    disabled={winClaiming}
                    sx={{ width: ['100%', '300px', '388px'] }}
                  >
                    {t('Claim NFB')}
                  </Button>
                )}
              </>
            ) : (
              <Link
                href="https://ape-swap.medium.com/apeswap-adds-launch-support-for-binances-first-soulbound-token-dbb2e0e4c263"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                {t('Read our Medium article >')}
              </Link>
            )}
          </Text>
        </Flex>
      </Flex>
      <Flex sx={{ width: ['240px', '414px'], height: ['240px', '414px'] }}>
        {wonPrize ? (
          <Flex
            sx={{
              ...styles.nfbImage,
              backgroundImage: `url(https://apeswap.mypinata.cloud/ipfs/QmYhuJnr3GGUnDGtg6rmSXTgo7FzaWgrriqikfgn5SkXhZ/${nfbNumber}.png)`,
            }}
          />
        ) : (
          <ReactPlayer playing muted loop url="videos/bab-nfb.mp4" height="100%" width="100%" playsInline />
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(BabInfoCard)
