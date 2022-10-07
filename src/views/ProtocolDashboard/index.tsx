/** @jsxImportSource theme-ui */
import 'chartjs-adapter-moment'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  TimeScale,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js'
import { Flex } from '@ape.swap/uikit'
import Banner from 'components/Banner'
import { TabNav } from 'components/TabNav'
import React, { useState } from 'react'
import Overview from './Overview'
import Treasury from './Treasury'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, TimeScale, ArcElement, Tooltip, Legend, Filler)

const ProtocolDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mb: '100px',
        marginTop: '10px',
      }}
    >
      <Flex sx={{ flexDirection: 'column', padding: '0px 10px', width: 'fit-contnet', maxWidth: '1150px' }}>
        <Flex sx={{ mt: '20px' }}>
          <Banner
            banner="protocol-dashboard"
            title="Protocol Dashboard"
            titleColor="primaryBright"
            link="https://apeswap.gitbook.io/apeswap-finance/product-and-features/protocol-dashboard"
            maxWidth={1130}
          />
        </Flex>
        <Flex sx={{ margin: '30px 0px' }}>
          <TabNav
            tabOptions={['Overview', 'Treasury', 'Products']}
            activeTab={activeTab}
            onChangeActiveTab={setActiveTab}
          />
        </Flex>
        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Treasury' && <Treasury />}
      </Flex>
    </Flex>
  )
}

export default React.memo(ProtocolDashboard)
