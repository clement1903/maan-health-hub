import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

type CountUpProps = {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({ to, suffix = "", prefix = "", duration = 1400, className }: CountUpProps) {
  const { ref, shown } = useReveal<HTMLParagraphElement>(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shown) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shown, to, duration]);

  return (
    <p ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </p>
  );
}
