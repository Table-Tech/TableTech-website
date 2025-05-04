import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const PrivacyPolicyPage: React.FC = () => (
  <>
    <Navbar />
    <div className="bg-gray-50 text-gray-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        </div>
    </div>
    <CallToAction />
    <Footer />
  </>
);