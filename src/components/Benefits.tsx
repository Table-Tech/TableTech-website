// src/components/Benefits.tsx
import React from "react";
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
    alt: "Clock icon representing faster table turnover",
    title: "Increase table turnover",
    desc: "Serve more guests faster with instant ordering.",
  },
  {
    imgSrc: workloadImg,
    alt: "Staff icon representing reduced workload",
    title: "Reduce staff workload",
    desc: "Let guests order on their own device—no extra trips.",
  },
  {
    imgSrc: experienceImg,
    alt: "Smile icon representing enhanced customer experience",
    title: "Enhance customer experience",
    desc: "Sleek, safe and seamless ordering for every guest.",
  },
];

export const Benefits: React.FC = () => (
  <section className="container mx-auto px-6 py-16">
    <h2 className="text-2xl font-bold text-center mb-12">Why TableTech?</h2>
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {data.map(({ imgSrc, alt, title, desc }) => (
        <div key={title} className="text-center">
          <img
            src={imgSrc}
            alt={alt}
            className="mx-auto mb-4 h-100 w-100 object-cover rounded-full shadow"
          />
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);
