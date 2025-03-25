"use client";

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

  if (!embedUrl) return null; // Don't render if URL is invalid

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
      <iframe
        src={embedUrl}
        title="Embedded Video"
        allowFullScreen
        frameBorder="0"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
