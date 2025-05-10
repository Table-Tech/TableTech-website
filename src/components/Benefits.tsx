// src/components/Benefits.tsx
import React, { useEffect, useRef, useState } from "react";
import turnoverImg from "../assets/turnover.png";
import workloadImg from "../assets/workload.png";
import experienceImg from "../assets/experience.png";

type Benefit = {
  imgSrc: string;
  alt: string;
  title: string;
  desc: string;
};

const data: Benefit[] = [
  {
    imgSrc: turnoverImg,
    alt: "Icoon van een klok voor snellere tafelomloop",
    title: "Snellere tafelomloop",
    desc: "Bedien meer gasten sneller dankzij directe bestellingen.",
  },
  {
    imgSrc: workloadImg,
    alt: "Icoon van personeel voor minder werkdruk",
    title: "Minder werkdruk voor personeel",
    desc: "Laat gasten zelf bestellen – geen onnodige loopjes meer.",
  },
  {
    imgSrc: experienceImg,
    alt: "Icoon van een glimlach voor betere klantervaring",
    title: "Betere klantervaring",
    desc: "Modern, veilig en soepel bestellen voor elke gast.",
  },
];

export const Benefits: React.FC = () => {
  const refs = useRef<HTMLDivElement[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(data.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const updated = [...visible];
        entries.forEach((entry) => {
          const index = refs.current.findIndex((el) => el === entry.target);
          if (entry.isIntersecting && index !== -1) {
            updated[index] = true;
          }
        });
        setVisible(updated);
      },
      { threshold: 0.3 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visible]);

  return (
    <section id="benefits" className="relative py-16 px-2">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-10 text-blue-900">
            Waarom TableTech?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map(({ imgSrc, alt, title, desc }, i) => (
              <div
                key={title}
                ref={(el) => {
                  if (el) refs.current[i] = el;
                }}
                className={`bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 text-center transform transition-all duration-1000 ease-out ${
                  visible[i]
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                } hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300`}
              >
                <div className="relative group">
                  <img
                    src={imgSrc}
                    alt={alt}
                    className="mx-auto mb-6 h-32 w-32 object-cover rounded-full shadow-md transform transition duration-300 group-hover:-translate-y-1 group-hover:ring-4 group-hover:ring-blue-100"
                  />
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-800 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
