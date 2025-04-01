import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import styles from "./style.module.scss";
import Link from 'next/link';
import Button from '../../../components/button';
import SocialMedia from '@/components/social-media';

const Footer = () => {
  const tickerWords = ["BLOG", "TECH", "LIFE"];

  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <Swiper
          slidesPerView={3}
          spaceBetween={8}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 4.5,
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 6,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 9,
              spaceBetween: 24,
            },
            1440: {
              slidesPerView: 12,
              spaceBetween: 24,
            }
          }}
        >
          <div className={styles.marquee}>
            {Array.from({ length: 10 }, (_, i) =>
              tickerWords.map((word, index) => (
                <SwiperSlide key={index}>
                  <span key={`${word}-${i}-${index}`}>{word}+++</span>
                </SwiperSlide>
              ))
            )}
          </div>
        </Swiper>
      </div>

      <div className={styles.container}>
        <div className={styles.newsletter}>
          <h2>
            STAY UPDATED WITH TRENDS
          </h2>
          <div className={styles.subscribe}>
            <input type="email" placeholder="Email" />
            <Button title="Subscribe" variant="secondary" type="submit" />
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.brand}>
            CESAR BLOG
          </p>
          <div className={styles.links}>
            <ul>
              <li>
                <Link href="/">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.social}>
          <p>@ Copywright</p>
          <SocialMedia className={styles.icons} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
