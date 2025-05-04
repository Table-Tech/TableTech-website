import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const AboutPage: React.FC = () => (
  <>
    <Navbar />
      <div className="bg-gray-50 text-gray-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About TableTech</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              At TableTech, we believe in smart digital solutions for the hospitality industry. Our team is passionate
              about making restaurant operations more efficient, smoother, and future-ready.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower restaurants by reducing pressure on staff, improving customer experience,
              and streamlining the ordering and payment process through simple and modern technology.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We provide a contactless solution where guests can scan a QR code at their table to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>View the digital menu</li>
              <li>Place their order directly from their phone</li>
              <li>Pay instantly without waiting</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Why Choose TableTech?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Faster service and reduced wait times</li>
              <li>Higher customer satisfaction</li>
              <li>Increased revenue through efficient operations</li>
              <li>Easy-to-use dashboard for kitchen and staff</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-700 leading-relaxed">
              TableTech is built by a young and motivated team with a background in IT, software, and business. We’re
              here to help restaurants grow and adapt to a digital world.
            </p>
          </section>
        </div>
      </div>

    <CallToAction />
    <Footer />
  </>
);