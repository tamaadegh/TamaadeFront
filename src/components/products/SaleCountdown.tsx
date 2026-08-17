"use client";

import { useEffect, useState } from "react";

type SaleCountdownProps = {
  endsAt?: string | null;
};

export function SaleCountdown({ endsAt }: SaleCountdownProps) {
  const [time, setTime] = useState({ days: 0, hrs: 0, mins: 0, secs: 0 });
  const [visible, setVisible] = useState(Boolean(endsAt));

  useEffect(() => {
    if (!endsAt) {
      setVisible(false);
      return;
    }
    const end = new Date(endsAt).getTime();
    if (Number.isNaN(end)) {
      setVisible(false);
      return;
    }

    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setVisible(diff > 0);
      setTime({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!visible) return null;

  const boxes = [
    { label: "DAYS", value: time.days },
    { label: "HRS", value: time.hrs },
    { label: "MINS", value: time.mins },
    { label: "SECS", value: time.secs },
  ];

  return (
    <div className="mt-5">
      <p className="text-sm font-medium text-gray-800">Sale ends in</p>
      <div className="mt-2 flex gap-2">
        {boxes.map((b) => (
          <div
            key={b.label}
            className="flex min-w-[52px] flex-col items-center rounded bg-[#f0f0f0] px-2 py-2"
          >
            <span className="text-lg font-bold tabular-nums text-gray-900">
              {String(b.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-medium text-gray-500">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
