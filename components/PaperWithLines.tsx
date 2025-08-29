import React, { ReactNode, useRef, useEffect, useState } from "react";

interface PaperWithLinesProps {
  children: ReactNode;
  lineHeight?: number;
  className?: string;
  extraLines?: number;
}

export default function PaperWithLines({
  children,
  lineHeight = 36,
  className = "",
  extraLines = 2,
}: PaperWithLinesProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [numLines, setNumLines] = useState(0);

  useEffect(() => {
    function updateLines() {
      if (paperRef.current) {
        const scrollH = paperRef.current.scrollHeight;
        setNumLines(Math.ceil(scrollH / lineHeight) + extraLines);
      }
    }
    updateLines();
    window.addEventListener("resize", updateLines);
    return () => {
      window.removeEventListener("resize", updateLines);
    };
  }, [children, lineHeight, extraLines]);

  return (
    <div
      className={`paper paper-with-lines ${className}`}
      ref={paperRef}
      style={{ position: "relative", background: "#f8f8f8" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
          zIndex: 0,
          height: "100%",
        }}
      >
        {Array.from({ length: numLines }).map((_, i) => (
          <hr
            key={i}
            style={{
              position: "absolute",
              top: `${i * lineHeight}px`,
              left: 0,
              width: "100%",
              border: "none",
              borderBottom: "1px solid #94acd4",
              margin: 0,
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
