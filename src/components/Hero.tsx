import React from "react";
import { Navbar } from "./Navbar";
import { LandingPage } from "../pages/LandingPage";
import { Benefits } from "./Benefits";
import { HowItWorks } from "./HowItWorks";
import { CallToAction } from "./CallToAction";
import { Footer } from "./Footer";

export const Hero: React.FC = () => (
  <>
    <Navbar />
    <LandingPage />
    <Benefits />
    <HowItWorks />
    <CallToAction />
    <Footer />
  </>
);
