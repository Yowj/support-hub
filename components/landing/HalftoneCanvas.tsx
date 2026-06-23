"use client";

import { useEffect, useRef } from "react";
import type P5Type from "p5";

const TONEMAKI_COLORS = [
  "#75ff9c", "#103729", "#bbbaad", "#141414",
  "#dad6c8", "#dddddd", "#fa233b", "#fa3c23",
  "#fefce1", "#ff7145", "#ff7575", "#fffbea",
  "#222222", "#454545", "#50ff6c", "#575757",
];

export default function HalftoneCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let p5Instance: P5Type | null = null;
    let cleanupListeners: (() => void) | null = null;
    let cancelled = false;

    import("p5").then(({ default: P5 }) => {
      if (cancelled || !containerRef.current) return;

      p5Instance = new P5((p: P5Type) => {
        let w: number, h: number;
        let rows = 40;
        let columns = 60;
        let xSpace: number, ySpace: number;
        let yWaveSize: number, xWaveSize: number;
        const yWaveLength = 5;
        const yWaveSpeed = 0.5;
        const yWaveOffset = 0.1;
        const xWaveLength = 5;
        const xWaveSpeed = 0.5;
        const xWaveOffset = 1;
        const animationPeriod = 5;
        const fadeDuration = 100;
        let fadeProgress = 0;
        let startTime: number;
        let inactivityTimeout: ReturnType<typeof setTimeout> | null = null;

        function calculateGrid() {
          rows = Math.floor(40 * 0.75);
          columns = Math.floor(60 * 0.75);
          xSpace = w / columns;
          ySpace = h / rows;
          yWaveSize = h * 0.3;
          xWaveSize = w * 0.3;
        }

        p.setup = function () {
          w = containerRef.current!.offsetWidth;
          h = containerRef.current!.offsetHeight;
          const cnv = p.createCanvas(w, h);
          cnv.parent(containerRef.current!);
          p.noStroke();
          calculateGrid();
          p.frameRate(10);
          startTime = p.millis();
          p.loop();

          function handleUserInteraction() {
            p.loop();
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => p.noLoop(), 600);
          }

          window.addEventListener("mousemove", handleUserInteraction);
          window.addEventListener("scroll", handleUserInteraction);

          cleanupListeners = () => {
            window.removeEventListener("mousemove", handleUserInteraction);
            window.removeEventListener("scroll", handleUserInteraction);
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
          };
        };

        p.draw = function () {
          p.clear();

          const elapsed = p.millis() - startTime;
          fadeProgress = p.constrain(elapsed / fadeDuration, 0, 1);

          const loopPhase = (p.frameCount % animationPeriod) / animationPeriod;

          p.push();
          p.translate(p.width / 2, p.height / 2);
          p.translate((-columns * xSpace) / 2, (-rows * ySpace) / 2);

          for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
              const sinValue = p.sin(p.TWO_PI * loopPhase + i * 0.5 + j * 0.5);
              let baseSize = p.map(Math.pow(sinValue, 5), -1, 1, 0.25, 2.5);
              baseSize = p.constrain(baseSize, 0.19, 1.875);
              const currentSize = baseSize * fadeProgress;

              const colorIndex = (i + j) % TONEMAKI_COLORS.length;
              const baseColor = p.color(TONEMAKI_COLORS[colorIndex]);
              baseColor.setAlpha(100 * fadeProgress);
              p.fill(baseColor);

              const yWave =
                p.sin(
                  p.frameCount * yWaveSpeed + i * yWaveLength + j * yWaveOffset
                ) * yWaveSize;
              const xWave =
                p.cos(
                  p.frameCount * xWaveSpeed + i * xWaveLength + j * xWaveOffset
                ) * xWaveSize;

              p.ellipse(i * xSpace + xWave, j * ySpace + yWave, currentSize, currentSize);
            }
          }

          p.pop();

          if (fadeProgress >= 1) p.noLoop();
        };

        p.windowResized = function () {
          w = containerRef.current!.offsetWidth;
          h = containerRef.current!.offsetHeight;
          p.resizeCanvas(w, h);
          calculateGrid();
        };
      }, containerRef.current);
    });

    return () => {
      cancelled = true;
      cleanupListeners?.();
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
