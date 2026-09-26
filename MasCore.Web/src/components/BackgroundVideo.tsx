export default function BackgroundVideo() {
  return (
    <>
      <video
        className="background-video"
        src="/VIUB2817.MP4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="background-overlay" />
      <div className="background-vignette" />
    </>
  );
}