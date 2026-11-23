import { useEffect, useMemo, useRef, useState } from "react";
import { TOP_BANNER, BOTTOM_BANNER } from "../adConfig";

// Renders one Adsterra banner unit inside its own sandboxed iframe.
//
// Why an iframe: Adsterra's script writes to a global `atOptions` variable and
// injects the ad where the script tag sits. React does not run <script> tags
// added through markup, and two banners on one page would overwrite each
// other's `atOptions`. A separate iframe per banner avoids both problems.
//
// The sandbox deliberately has no `allow-same-origin`, so the ad code cannot
// read the site's cookies/localStorage (where the Supabase session lives).
function AdBanner({ unit, className = "" }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  const srcDoc = useMemo(() => {
    if (!unit) return "";
    const options = JSON.stringify({
      key: unit.key,
      format: "iframe",
      height: unit.height,
      width: unit.width,
      params: {},
    });
    return `<!doctype html>
<html>
  <head><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style></head>
  <body>
    <script>atOptions = ${options};</script>
    <script data-cfasync="false" src="${unit.scriptSrc}"></script>
  </body>
</html>`;
  }, [unit]);

  // Shrink the fixed-size banner on narrow screens so it never overflows.
  useEffect(() => {
    if (!unit || !wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => {
      setScale(Math.min(1, el.clientWidth / unit.width));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [unit]);

  if (!unit) return null;

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={wrapperRef}
        className="w-full flex justify-center overflow-hidden"
        style={{ height: unit.height * scale }}
      >
        <iframe
          title="Advertisement"
          srcDoc={srcDoc}
          width={unit.width}
          height={unit.height}
          scrolling="no"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
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

export function TopBanner() {
  return <AdBanner unit={TOP_BANNER} className="py-2 bg-main" />;
}

export function BottomBanner() {
  return <AdBanner unit={BOTTOM_BANNER} className="py-2 bg-main" />;
}

export default AdBanner;
