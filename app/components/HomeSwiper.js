'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel, Keyboard, Parallax, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import { projects } from '../data/projects';

export default function HomeSwiper() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="fullscreen">
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Parallax, Pagination, Scrollbar, A11y, Mousewheel, Keyboard, Thumbs]}
        spaceBetween={0}
        slidesPerView={1}
        direction="vertical"
        mousewheel={true}
        keyboard={true}
        speed={1000}
        freemode={true}
        thumbs={{ swiper: thumbsSwiper }}
        parallax={true}
        loop={true}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="main-swiper"
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project.id}>
            <Link href={`/works/${project.slug}`}>
              <div className="slide-container">
                <Image
                  data-swiper-parallax="30%"
                  data-swiper-parallax-scale="1.2"
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  priority={index === 0}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs Gallery Overlay */}
      <div className="overlay-gallery">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, Parallax, A11y, Mousewheel, Keyboard, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={0}
          slidesPerView={1}
          speed={1000}
          direction="vertical"
          watchSlidesProgress={true}
          loop={true}
          parallax={true}
          className="thumbs-swiper"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <div className="slide-content">
                {/* Square Image */}
                <div className="slide-image">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    data-swiper-parallax="30%"
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                {/* Text Content */}
                <div className="slide-text">
                  <span className="counter">{currentSlide + 1}/{projects.length}</span>
                  <span className="category">{project.category}</span>
                  <h2>{project.title}</h2>
                  <div className="project-info">
                    {project.location}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
