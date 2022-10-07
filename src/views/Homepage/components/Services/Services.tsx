/** @jsxImportSource theme-ui */
import React, { useEffect, useState } from 'react'
import { Text, Flex, Skeleton } from '@ape.swap/uikit'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import useSwiper from 'hooks/useSwiper'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useWindowSize from 'hooks/useDimensions'
import { ServiceData } from 'state/types'
import { useFetchHomepageServiceStats, useHomepageServiceStats } from 'state/hooks'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { useTranslation } from 'contexts/Localization'
import { getDotPos } from 'utils/getDotPos'
import { styles, YieldCard } from './styles'
import { defaultServiceData } from './defaultServiceData'

const Services: React.FC<{ bab?: boolean }> = ({ bab }) => {
  const { swiper, setSwiper } = useSwiper()
  const [loadServices, setLoadServices] = useState(false)
  useFetchHomepageServiceStats(loadServices)
  const [activeSlide, setActiveSlide] = useState(0)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { width } = useWindowSize()
  const { t } = useTranslation()
  const serviceData = useHomepageServiceStats()
  const displayData =
    serviceData &&
    defaultServiceData(t).map((service) => {
      return { ...service, stats: serviceData[service.id] }
    })
  const slideNewsNav = (index: number) => {
    setActiveSlide(index)
    swiper.slideTo(displayData?.length + index)
    swiper.autoplay.start()
  }

  const handleSlide = (event: SwiperCore) => {
    const slideNumber = getDotPos(event.activeIndex, displayData.length)
    setActiveSlide(slideNumber)
  }

  useEffect(() => {
    if (isIntersecting) {
      setLoadServices(true)
    }
  }, [isIntersecting])

  const handleEachService = (id: string, service: ServiceData) => {
    if (id === 'farmDetails' || id === 'poolDetails' || id === 'billDetails') {
      const tokenImage =
        id === 'farmDetails'
          ? service.stakeToken.name.split('-')
          : id === 'billDetails'
          ? service?.lpTokenName.split('-')
          : [service.stakeToken.name, service.rewardToken.name]
      const name =
        id === 'farmDetails'
          ? service.stakeToken.name
          : id === 'billDetails'
          ? service?.lpTokenName
          : service.rewardToken.name
      return { name, tokenImage }
    }
    if (id === 'lendingDetails') {
      return { name: service.marketName, tokenImage: [service.token.name] }
    }
    return {}
  }

  const displayStats = (id: string, link: string, stats: ServiceData[]) => {
    return (
      <>
        <Flex
          sx={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: '60px',
            height: '250px',
            width: '93%',
          }}
        >
          {stats?.map((stat) => {
            const { name, tokenImage } = handleEachService(id, stat)
            return (
              <a href={stat?.link} rel="noopener noreferrer" key={stat?.apr}>
                <Flex
                  sx={{
                    width: ['100%', '100%', '95%'],
                    height: '70px',
                    background: 'rgba(11, 11, 11, .55)',
                    borderRadius: '10px',
                    marginTop: '5px',
                    marginBottom: '5px',
                    paddingLeft: '20px',
                  }}
                >
                  {id === 'farmDetails' ? (
                    <ServiceTokenDisplay
                      token1={tokenImage[0]}
                      token2={tokenImage[1]}
                      token3={stat.rewardToken.name}
                      stakeLp
                      iconFill="white"
                    />
                  ) : id === 'billDetails' ? (
                    <ServiceTokenDisplay
                      token1={tokenImage[0]}
                      token2={tokenImage[1]}
                      token3={stat.earnTokenName}
                      stakeLp
                      billArrow
                      iconFill="white"
                    />
                  ) : id === 'poolDetails' ? (
                    <ServiceTokenDisplay token1={tokenImage[0]} token2={tokenImage[1]} iconFill="white" />
                  ) : (
                    <ServiceTokenDisplay token1={tokenImage[0]} />
                  )}
                  <Flex sx={{ paddingLeft: '15px', justifyContent: 'center', flexDirection: 'column' }}>
                    <Text sx={{ width: '100%', color: 'white', fontWeight: 700 }}>{name}</Text>
                    {id === 'lendingDetails' ? (
                      <Text sx={{ width: '100%', color: 'primaryBright', fontWeight: 400 }}>
                        APY: {stat.apy.toFixed(2)}%
                      </Text>
                    ) : id === 'billDetails' ? (
                      <Text sx={{ width: '100%', color: 'primaryBright', fontWeight: 400 }}>
                        Discount:{' '}
                        <span sx={{ color: stat.discount > 0 ? 'primaryBright' : '#DF4141' }}>
                          {stat.discount.toFixed(2)}%
                        </span>
                      </Text>
                    ) : (
                      <Text sx={{ width: '100%', color: 'primaryBright', fontWeight: 400 }}>
                        APR: {(stat.apr * 100).toFixed(2)}%
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </a>
            )
          })}
        </Flex>
        <a href={link} rel="noopener noreferrer">
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Text sx={{ color: 'primaryBright', fontSize: '16px', fontWeight: 700 }}>
              {t('See All')} {'>'}
            </Text>
          </Flex>
        </a>
      </>
    )
  }

  return (
    <>
      <div ref={observerRef} />
      <Flex
        sx={{ ...styles.colorWrap, background: (bab && 'white1') || 'white2', paddingTop: bab && ['50px', '100px'] }}
      >
        {bab && (
          <Text
            sx={{
              textAlign: 'center',
              lineHeight: ['38px', '45px'],
              fontSize: ['25px', '30px'],
              fontWeight: 700,
              margin: '0 0 0 0',
              width: ['80%', 'auto'],
            }}
          >
            {t('Featured ApeSwap Products')}
          </Text>
        )}
        <Flex sx={{ ...styles.serviceWrapper, padding: bab && '30px 0 90px 0', height: !bab && '610px' }}>
          {displayData ? (
            width < 1488 ? (
              <Swiper
                id="serviceSwiper"
                initialSlide={0}
                onSwiper={setSwiper}
                spaceBetween={20}
                slidesPerView="auto"
                loopedSlides={displayData?.length}
                autoplay={{ delay: 5000 }}
                loop
                centeredSlides
                resizeObserver
                lazy
                preloadImages={false}
                onSlideChange={handleSlide}
                breakpoints={{
                  480: {
                    centeredSlides: false,
                  },
                }}
              >
                {displayData?.map((service) => {
                  return (
                    <SwiperSlide
                      style={{
                        maxWidth: '338px',
                        minWidth: '300px',
                      }}
                      key={service.title}
                    >
                      <YieldCard image={service.backgroundImg}>
                        <Flex
                          sx={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            width: '100%',
                          }}
                        >
                          <Flex sx={{ flexDirection: 'column', padding: ['15px 5px', '20px 5px'], gap: '5px' }}>
                            <Text
                              sx={{
                                fontSize: '23px',
                                color: 'primaryBright',
                                fontWeight: 700,
                              }}
                            >
                              {service.title}
                            </Text>
                            <Text
                              sx={{
                                fontSize: '15px',
                                color: 'primaryBright',
                                fontWeight: 700,
                              }}
                            >
                              {service.description}
                            </Text>
                          </Flex>
                          {displayStats(service.id, service.link, service.stats)}
                        </Flex>
                      </YieldCard>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            ) : (
              displayData?.map((service) => {
                return (
                  <YieldCard image={service.backgroundImg} key={service.id}>
                    <Flex
                      sx={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      <Flex sx={{ flexDirection: 'column', padding: ['15px 5px', '20px 5px'], gap: '5px' }}>
                        <Text
                          sx={{
                            fontSize: '23px',
                            color: 'primaryBright',
                            fontWeight: 700,
                          }}
                        >
                          {service.title}
                        </Text>
                        <Text
                          sx={{
                            fontSize: '15px',
                            color: 'primaryBright',
                            fontWeight: 700,
                          }}
                        >
                          {service.description}
                        </Text>
                      </Flex>
                      {displayStats(service.id, service.link, service.stats)}
                    </Flex>
                  </YieldCard>
                )
              })
            )
          ) : (
            [...Array(4)].map((i) => {
              return (
                <YieldCard key={i}>
                  <Skeleton height="100%" width="100%" />
                </YieldCard>
              )
            })
          )}
          <Flex
            sx={{
              justifyContent: 'center',
              alignContent: 'center',
              position: 'absolute',
              bottom: '35px',
              left: '0',
              width: '100%',
            }}
          >
            {[...Array(displayData?.length)].map((_, i) => {
              return (
                <Flex
                  sx={{
                    ...styles.bubble,
                    background:
                      (i === activeSlide && 'linear-gradient(53.53deg, #a16552 15.88%, #e1b242 92.56%)') || 'white4',
                  }}
                  onClick={() => slideNewsNav(i)}
                  key={i}
                />
              )
            })}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default React.memo(Services)
