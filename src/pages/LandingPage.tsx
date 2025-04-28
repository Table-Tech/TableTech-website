import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Benefits } from "../components/Benefits";
import { HowItWorks } from "../components/HowItWorks";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const LandingPage: React.FC = () => (
  <>
    <Navbar />
    <Hero />
    <Benefits />
    <HowItWorks />
    <CallToAction />
    <Footer />
  </>
);
