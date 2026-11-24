import { useEffect, useRef, useState } from "react";

// Adsterra ad code, pasted exactly as given by Adsterra.
// Each ad lives in its own iframe (srcDoc) so that:
//  - the <script> tags actually run (React doesn't run scripts added as markup)
//  - several banners on one page don't overwrite each other's `atOptions`
const TOP_BANNER_HTML = `<!doctype html>
<html>
  <head>
    <style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style>
  </head>
  <body>
  <script data-cfasync="false" src="https://bicea.org/14/ed0c4296d534f54c9eff49b9204f8080"></script>
  </body>
</html>`;

// To add the second ad: paste its code the same way as above, e.g.
// const BOTTOM_BANNER_HTML = `...`;
// and render it with <AdFrame html={BOTTOM_BANNER_HTML} width={..} height={..} />

function AdFrame({ html, width, height, className = "" }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Shrink the fixed-size banner on narrow screens so it never overflows.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={wrapperRef}
        className="w-full flex justify-center overflow-hidden"
        style={{ height: height * scale }}
      >
        <iframe
          title="Advertisement"
          srcDoc={html}
          width={width}
          height={height}
          scrolling="no"
          style={{
            border: 0,
            flexShrink: 0,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        />
      </div>
    </div>
  );
}

export function AdSocialBar() {
  return (
    <AdFrame
      html={TOP_BANNER_HTML}
      width={728}
      height={90}
      className="py-2 bg-main"
    />
  );
}

export default AdFrame;
