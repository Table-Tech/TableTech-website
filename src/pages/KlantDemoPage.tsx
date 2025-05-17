import React from "react";
import PhoneMock from "../components/PhoneMock";

const KlantDemoPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-bold mb-4">Ervaar hoe makkelijk het is</h1>
      <p className="mb-6 text-center max-w-md">
        Simuleer hoe gasten bestellingen plaatsen via hun telefoon.
      </p>
      <PhoneMock />
    </div>
  );
};

export default KlantDemoPage;
