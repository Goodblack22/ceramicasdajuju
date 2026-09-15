"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="pd-thumbs">
        {images.map((src, i) => (
          <div
            key={src}
            className={i === active ? "active" : ""}
            onClick={() => setActive(i)}
          >
            <Image src={src} alt="" width={90} height={90} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <div className="pd-gallery-main">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width: 860px) 100vw, 40vw"
          style={{ objectFit: "cover", borderRadius: 10 }}
        />
      </div>
    </>
  );
}
