// src/pages/LandingPage/Benefits3.tsx
import React, { useEffect, useRef, useState } from "react";
import plantenBg from "../../assets/afbeeldingen/Planten.png";
import tabletechPhoneImg from "../../assets/afbeeldingen/Telefoon.png";

type Benefit = {
  icon: string;
  title: string;
  desc: string;
};

const data: Benefit[] = [
  {
    icon: "💰",
    title: "Verhoog je omzet",
    desc: "Meer orders per uur dankzij snellere doorloop en digitale upselling.",
  },
  {
    icon: "📱",
    title: "Contactloos bestellen",
    desc: "Veilig en hygiënisch bestellen zonder fysiek contact met personeel.",
  },
  {
    icon: "⚡",
    title: "Instant betalingen",
    desc: "Gasten betalen direct online, geen gedoe meer met pinnen aan tafel.",
  },
];

export const Benefits3: React.FC = () => {
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
    <section
      id="benefits3"
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat snap-start shrink-0 overflow-hidden"
      style={{ backgroundImage: `url(${plantenBg})` }}
    >
      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-[#3b2a1d]/25 z-0" />

      {/* Inhoud */}
      <div className="relative z-10 w-full max-w-screen-3xl px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-40 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Telefoonmockup */}
        <div className="w-full max-w-sm flex justify-center">
          <img
            src={tabletechPhoneImg}
            alt="TableTech app mockup"
            className="w-full max-w-[300px] rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-500"
          />
        </div>

        {/* Cards */}
        <div className="w-full max-w-6xl bg-[#f5efe7]/85 backdrop-blur-md border border-[#b89b85]/30 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#5e3d2b]">
            Extra voordelen van TableTech
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                ref={(el) => {
                  if (el) refs.current[i] = el;
                }}
                className={`bg-[#fff8f3]/70 backdrop-blur-md border border-[#d8c4b1]/50 rounded-2xl p-6 text-center transform transition-all duration-1000 ease-out ${
                  visible[i]
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                } hover:scale-[1.03] hover:shadow-xl`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <div className="relative group mb-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#e9d7c2] to-[#d8c4b1] rounded-full flex items-center justify-center text-4xl shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                    {icon}
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-2 text-[#4b2e1e]">
                  {title}
                </h3>
                <p className="text-[#5f4534] text-sm md:text-base leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};