"use client";

import Image from "next/image";

export default function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/J3J81AEG3V"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
        alt="Buy Me a Coffee at ko-fi.com"
        width={144}
        height={18}
        style={{ border: "0px" }}
      />
    </a>
  );
}
