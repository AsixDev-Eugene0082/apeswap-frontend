/** @jsxImportSource theme-ui */
import { Flex, Modal, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { apiBaseUrl } from 'hooks/api'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const BLOCKED_ADDRESSES: string[] = [
  '0x7Db418b5D567A4e0E8c59Ad71BE1FcE48f3E6107',
  '0x72a5843cc08275C8171E582972Aa4fDa8C397B2A',
  '0x7F19720A857F834887FC9A7bC0a0fBe7Fc7f8102',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A',
  '0x9F4cda013E354b8fC285BF4b9A60460cEe7f7Ea9',
  '0x19Aa5Fe80D33a56D56c78e82eA5E50E5d80b4Dff',
  '0x2f389cE8bD8ff92De3402FFCe4691d17fC4f6535',
  '0xe7aa314c77F4233C18C6CC84384A9247c0cf367B',
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
  '0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963',
  '0x308eD4B7b49797e1A98D3818bFF6fe5385410370',
  '0xC455f7fd3e0e12afd51fba5c106909934D8A0e4a',
  '0x3CBdeD43EFdAf0FC77b9C55F6fC9988fCC9b757d',
  '0x67d40EE1A85bf4a4Bb7Ffae16De985e8427B6b45',
  '0x6F1cA141A28907F78Ebaa64fb83A9088b02A8352',
  '0x6aCDFBA02D390b97Ac2b2d42A63E85293BCc160e',
  '0x48549a34ae37b12f6a30566245176994e17c6b4a',
  '0x5512d943ed1f7c8a43f3435c85f7ab68b30121b0',
  '0xC455f7fd3e0e12afd51fba5c106909934D8A0e4a',
  '0x629e7Da20197a5429d30da36E77d06CdF796b71A',
  '0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9',
  '0x098B716B8Aaf21512996dC57EB0615e2383E2f96',
  '0xfEC8A60023265364D066a1212fDE3930F6Ae8da7',
  '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
  '0x722122dF12D4e14e13Ac3b6895a86e84145b6967',
  '0xDD4c48C0B24039969fC16D1cdF626eaB821d3384',
  '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
  '0xd96f2B1c14Db8458374d9Aca76E26c3D18364307',
  '0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D',
  '0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3',
  '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',
  '0xA160cdAB225685dA1d56aa342Ad8841c3b53f291',
  '0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144',
  '0xF60dD140cFf0706bAE9Cd734Ac3ae76AD9eBC32A',
  '0x22aaA7720ddd5388A3c0A3333430953C68f1849b',
  '0xBA214C1c1928a32Bffe790263E38B4Af9bFCD659',
  '0xb1C8094B234DcE6e03f10a5b673c1d8C69739A00',
  '0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce',
  '0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2',
  '0xD691F27f38B395864Ea86CfC7253969B409c362d',
  '0xaEaaC358560e11f52454D997AAFF2c5731B6f8a6',
  '0x1356c899D8C9467C7f71C195612F8A395aBf2f0a',
  '0xA60C772958a3eD56c1F15dD055bA37AC8e523a0D',
  '0x169AD27A470D064DEDE56a2D3ff727986b15D52B',
  '0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f',
  '0xF67721A2D8F736E75a49FdD7FAd2e31D8676542a',
  '0x9AD122c22B14202B4490eDAf288FDb3C7cb3ff5E',
  '0x905b63Fff465B9fFBF41DeA908CEb12478ec7601',
  '0x07687e702b410Fa43f4cB4Af7FA097918ffD2730',
  '0x94A1B5CdB22c43faab4AbEb5c74999895464Ddaf',
  '0xb541fc07bC7619fD4062A54d96268525cBC6FfEF',
  '0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc',
  '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936',
  '0x23773E65ed146A459791799d01336DB287f25334',
  '0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af',
  '0x610B717796ad172B316836AC95a2ffad065CeaB4',
  '0x178169B423a011fff22B9e3F3abeA13414dDD0F1',
  '0xbB93e510BbCD0B7beb5A853875f9eC60275CF498',
  '0x2717c5e28cf931547B621a5dddb772Ab6A35B701',
  '0x03893a7c7463AE47D46bc7f091665f1893656003',
  '0xCa0840578f57fE71599D29375e16783424023357',
  '0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2',
  '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
  '0x722122dF12D4e14e13Ac3b6895a86e84145b6967',
  '0xDD4c48C0B24039969fC16D1cdF626eaB821d3384',
  '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
  '0xd96f2B1c14Db8458374d9Aca76E26c3D18364307',
  '0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D',
  '0x489A8756C18C0b8B24EC2a2b9FF3D4d447F79BEc',
]

export default function Blocklist({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [geoLocation, setGeoLocation] = useState<{ isRestrictedRegion: boolean; countryCode: string }>({
    isRestrictedRegion: false,
    countryCode: '',
  })
  const { account } = useActiveWeb3React()

  // Fetch country code to check if the region is allowed
  useEffect(() => {
    const fetchLocation = async () => {
      const resp = await axios.get(`${apiBaseUrl}/check`)
      const { isRestrictedRegion, countryCode } = resp?.data
      setGeoLocation({ isRestrictedRegion, countryCode })
    }
    fetchLocation()
  }, [])

  const blockedAddress: boolean = useMemo(
    () => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1),
    [account],
  )

  if (blockedAddress) {
    return (
      <Flex>
        <Text>{t('Blocked address')}</Text>
      </Flex>
    )
  }
  if (geoLocation.isRestrictedRegion) {
    return (
      <>
        <Modal minWidth="360px" maxWidth="600px">
          <Flex sx={{ width: 'auto', height: 'auto', justifyContent: 'center', flexDirection: 'column' }}>
            <Text weight={700} sx={{ fontFamily: 'poppins', fontSize: '32px' }}>
              Notice
            </Text>
            <br />
            <Text
              sx={{ fontFamily: 'poppins' }}
            >{`Due to recent events causing increased legal scrutiny throughout the DeFi industry, ApeSwap has been given no choice but to restrict select regions from accessing our offerings. You are receiving this notice, because it appears you are visiting from a restricted region, ${geoLocation.countryCode}.`}</Text>
            <br />
            <Text sx={{ fontFamily: 'poppins' }}>
              We say this with heavy hearts, as censorship of any kind has been deeply against our ethos since day 1. We
              do not make this move lightly, but it is necessary for the continuity of our protocol & the safety of
              several core team contributors. We apologize in advance for inconveniences caused.
            </Text>
            <br />
            <Text sx={{ fontFamily: 'poppins' }}>
              For more information about this change or to find out how it impacts you, please visit{' '}
              <a
                href="https://t.me/ape_swap"
                rel="noopener noreferrer"
                sx={{ textDecoration: 'underline', color: 'grey' }}
              >
                our Telegram.
              </a>
            </Text>
          </Flex>
        </Modal>
      </>
    )
  }
  return <>{children}</>
}
