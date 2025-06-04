import React, { useEffect, useRef, useState } from "react";
import dashboardImg from "../../assets/afbeeldingen/dashboard-mockup.png";

export const DashboardPreview: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="dashboard"
      className="relative py-20 px-4 bg-[#2C1E1A] w-full overflow-x-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-t from-transparent to-[#2C1E1A] z-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="bg-[#E6DED5]/90 backdrop-blur-md border border-[#C7B4A2]/40 rounded-3xl shadow-2xl p-10 transition-all duration-700">
          <h2 className="text-2xl font-bold mb-4 text-[#3E2B21] text-center">
            Beheer alles in één dashboard
          </h2>
          <p className="text-[#5A4235] mb-8 max-w-2xl mx-auto text-center text-sm">
            Volg live bestellingen, analyseer je omzet per dag of week en pas je menukaart in een paar klikken aan. Alles realtime.
          </p>

          <div
            ref={ref}
            className={`flex flex-col lg:flex-row items-center justify-center gap-8 transform transition-all duration-1000 ease-out ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            <img
              src={dashboardImg}
              alt="Dashboard weergave"
              loading="lazy"
              className="w-full lg:w-1/2 max-w-sm rounded-2xl shadow-xl border border-[#D3C3B6]/40 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            />
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full lg:w-1/2 max-w-sm rounded-xl shadow-lg border border-[#D3C3B6]/40 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <source src="/videos/Qr Code.mp4" type="video/mp4" />
              Je browser ondersteunt geen video.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};
