/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import useSwiper from 'hooks/useSwiper'
import 'swiper/swiper.min.css'
import { Flex } from '@apeswapfinance/uikit'
import { Bubble } from './styles'
import { getDotPos } from 'utils/getDotPos'
import { utilitySlides } from './UtilitySlides'

const MobileCard = () => {
  const { swiper, setSwiper } = useSwiper()
  const [activeSlide, setActiveSlide] = useState(0)

  const handleSlide = (event: SwiperCore) => {
    const slideNumber = getDotPos(event.activeIndex, utilitySlides.length)
    setActiveSlide(slideNumber)
  }
  const slideNewsNav = (index: number) => {
    setActiveSlide(index)
    swiper.slideTo(index)
  }
  return (
    <>
      <Swiper
        id="serviceSwiper"
        initialSlide={0}
        onSwiper={setSwiper}
        spaceBetween={20}
        slidesPerView={1}
        loopedSlides={utilitySlides?.length}
        centeredSlides
        resizeObserver
        lazy
        preloadImages={false}
        onSlideChange={handleSlide}
      >
        {utilitySlides.map((slide, index) => {
          return (
            <SwiperSlide style={{ display: 'flex', justifyContent: 'center' }} key={slide.key}>
              {slide}
            </SwiperSlide>
          )
        })}
      </Swiper>
      <Flex justifyContent="center" alignContent="center" style={{ width: '100%', marginTop: '30px' }}>
        {[...Array(utilitySlides?.length)].map((_, i) => {
          return <Bubble isActive={i === activeSlide} onClick={() => slideNewsNav(i)} key={i} />
        })}
      </Flex>
    </>
  )
}

export default MobileCard
