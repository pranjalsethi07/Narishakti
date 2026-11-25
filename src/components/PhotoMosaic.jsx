import { useLanguage } from '../context/languageContextValue';
import { LANDING_PHOTOS } from '../data/landingPhotos';

// A wall of photos under the landing hero. Uses CSS columns, so every picture keeps its own
// proportions (nothing is cropped, faces stay whole) and the columns re-flow on any screen width.
const PhotoMosaic = () => {
  const { t } = useLanguage();

  return (
    <section style={styles.section} aria-labelledby="women-title">
      <div style={styles.inner}>
        <h2 id="women-title" className="h2" style={styles.title}>{t('photosTitle')}</h2>
        <p style={styles.sub}>{t('photosSub')}</p>

        <div style={styles.masonry}>
          {LANDING_PHOTOS.map((photo) => (
            <figure key={photo.src} style={styles.figure}>
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                loading="lazy"
                decoding="async"
                style={styles.img}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '72px 24px 56px', backgroundColor: 'var(--bg-color)' },
  inner: { maxWidth: '1200px', margin: '0 auto' },
  title: { color: 'var(--primary-dark)', marginBottom: '10px', textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' },
  sub: { color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center', maxWidth: '58ch', margin: '0 auto 36px', lineHeight: 1.6 },
  masonry: { columnWidth: '220px', columnGap: '14px' },
  figure: { margin: '0 0 14px', breakInside: 'avoid', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--primary-light)' },
  img: { display: 'block', width: '100%', height: 'auto' },
};

export default PhotoMosaic;
