import React, { useEffect, useRef, useState } from "react";
import turnoverImg from "../assets/turnover.png";
import workloadImg from "../assets/workload.png";
import experienceImg from "../assets/experience.png";
import plantenBg from "../assets/Planten.png";

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
    const observer = new IntersectionObserver((entries) => {
      const updated = [...visible];
      entries.forEach((entry) => {
        const index = refs.current.findIndex((el) => el === entry.target);
        if (entry.isIntersecting && index !== -1) {
          updated[index] = true;
        }
      });
      setVisible(updated);
    }, { threshold: 0.3 });

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visible]);

  return (
    <section
      id="benefits"
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat snap-start shrink-0"
      style={{ backgroundImage: `url(${plantenBg})` }}
    >
      <div className="absolute inset-0 bg-[#3b2a1d]/20 z-0" />
      <div className="relative z-10 w-full px-4 flex justify-end transform scale-[0.85] origin-center">
        <div className="w-full max-w-3xl bg-[#f5efe7]/80 backdrop-blur-md border border-[#b89b85]/30 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-10 text-[#5e3d2b]">
            Waarom TableTech?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map(({ imgSrc, alt, title, desc }, i) => (
              <div
                key={title}
                ref={(el) => {
                  if (el) refs.current[i] = el;
                }}
                className={`bg-[#fff8f3]/60 backdrop-blur-md border border-[#d8c4b1]/50 rounded-2xl p-6 text-center transform transition-all duration-1000 ease-out ${
                  visible[i]
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                } hover:scale-[1.03] hover:shadow-xl transition-transform duration-300`}
              >
                <div className="relative group">
                  <img
                    src={imgSrc}
                    alt={alt}
                    className="mx-auto mb-6 h-32 w-32 object-cover rounded-full shadow-md transform transition duration-300 group-hover:-translate-y-1 group-hover:ring-4 group-hover:ring-[#e9d7c2]"
                  />
                </div>
                <h3 className="text-base font-semibold mb-2 text-[#4b2e1e]">{title}</h3>
                <p className="text-[#5f4534] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
