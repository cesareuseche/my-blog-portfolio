import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import styles from "./style.module.scss";

const Footer = () => {
  const tickerWords = ["BLOG", "TECH", "LIFE"];

  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <Swiper
          slidesPerView={12}
          spaceBetween={24}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
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
          <h2>DESIGN NEWS TO YOUR INBOX</h2>
          <div className={styles.subscribe}>
            <input type="email" placeholder="Email" />
            <button>SIGN UP</button>
          </div>
        </div>

        <div className={styles.footerContent}>
          <div className={styles.brand}>FYRRE MAGAZINE</div>
          <div className={styles.links}>
            <ul>
              <li>Art</li>
              <li>Design</li>
              <li>Architecture</li>
            </ul>
            <ul>
              <li>Magazine</li>
              <li>Podcast</li>
              <li>Authors</li>
            </ul>
            <ul>
              <li>Styleguide</li>
              <li>Licensing</li>
              <li>Changelog</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© Made by Pawel Gola - Powered by Webflow</p>
          <div className={styles.socialIcons}>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
