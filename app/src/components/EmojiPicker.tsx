"use client";

import { useState, useRef, useEffect } from "react";

const EMOJIS = [
  "🌸", "🌺", "🌻", "🌹", "🌷", "🌿", "🌱", "🌳", "🌴", "🌵",
  "⭐", "🌟", "✨", "🔥", "💫", "🌈", "☀️", "🌙", "💧", "🌊",
  "❤️", "💛", "💚", "💙", "💜", "🧡", "🤍", "🖤", "💝", "💖",
  "🕊️", "🦋", "🐚", "🌍", "🌎", "🌏", "🍃", "🍂", "🎋", "🎍",
  "👑", "🎀", "🎭", "🎨", "📖", "📚", "✍️", "🎯", "💡", "🔮",
  "🤝", "💪", "🧘", "🙏", "☮️", "🕉️", "🪷", "🔱", "⚖️", "🎵",
  "💎", "🔑", "🗝️", "🎁", "🏆", "🥇", "🌄", "🏔️", "⛰️", "🏕️",
  "🐉", "🦅", "🐺", "🦁", "🐘", "🦚", "🦩", "🐝", "🦉", "🐢",
  "🍵", "🧘‍♀️", "🎋", "🏮", "🎐", "🪷", "🌾", "🌼", "🌲", "☘️",
];

export default function EmojiPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-lg border border-saffron/20 bg-white flex items-center justify-center text-xl cursor-pointer hover:border-saffron/50 transition-colors">
        {value || "😊"}
      </button>
      {open && (
        <div className="absolute top-11 left-0 z-50 w-[280px] bg-white border border-saffron/20 rounded-xl shadow-xl p-2.5 grid grid-cols-10 gap-0.5">
          {EMOJIS.map(e => (
            <button key={e} type="button" onClick={() => { onChange(e); setOpen(false); }}
              className="w-6 h-6 flex items-center justify-center text-sm rounded hover:bg-saffron/10 cursor-pointer transition-colors">
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
