"use client";
import styles from "./style.module.scss";

type VideoEmbedProps = {
  url: string;
};

export default function VideoEmbed({ url }: VideoEmbedProps) {
  let embedUrl = "";

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([^&]+)/)?.[1];
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("vimeo.com")) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  if (!embedUrl) return null;

  return (
    <div className={styles.video__embed}>
      <iframe
        src={embedUrl}
        title="Embedded Video"
        allowFullScreen
      />
    </div>
  );
}
