// src/components/DashboardPreview.tsx
import React, { useEffect, useRef, useState } from "react";
import dashboardImg from "../assets/dashboard-mockup.png";

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
      className="relative z-0 bg-gradient-to-b from-blue-50 via-white to-cyan-50 py-24 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-10 transition-all duration-700">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            Beheer alles in één dashboard
          </h2>
          <p className="text-gray-700 mb-10 max-w-2xl mx-auto text-center">
            Volg live bestellingen, analyseer je omzet per dag of week en pas je menukaart in een paar klikken aan. Alles realtime.
          </p>

          <div
            ref={ref}
            className={`flex flex-col lg:flex-row items-center justify-center gap-10 transform transition-all duration-1000 ease-out ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            {/* 📊 Dashboard afbeelding */}
            <img
              src={dashboardImg}
              alt="Dashboard weergave"
              className="w-full lg:w-1/2 max-w-md rounded-2xl shadow-xl border border-white/40 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            />

            {/* 🎥 QR-scan video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full lg:w-1/2 max-w-md rounded-xl shadow-lg border border-white/40 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
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
