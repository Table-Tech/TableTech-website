import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import { FaUser, FaEnvelope, FaPhone, FaBuilding } from "react-icons/fa";

export const ContactPage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) return;

    emailjs
      .sendForm(
        "service_fye4t2s",
        "template_g0yqwdl",
        form.current,
        "WvojOqr0UVF9lHbU_"
      )
      .then(() => {
        alert("Message sent!");
        form.current?.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert("Something went wrong, please try again.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 py-16 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions? We're here for you</h2>
          <p className="mb-4 max-w-xl mx-auto text-sm md:text-base">
            If you'd like to get in touch about sales or business inquiries, leave your contact details
            and we'll get back to you as soon as possible.
          </p>
          <p className="mb-6 max-w-xl mx-auto text-sm md:text-base">
            For <strong>support</strong> inquiries, please email us at{" "}
            <a href="mailto:info@tabletech.nl" className="text-orange-400 font-semibold underline">
              info@tabletech.nl
            </a>
            .
          </p>
        </div>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-gray-500 mt-8 max-w-4xl mx-auto rounded-xl p-6 md:p-10 space-y-6"
        >
          <h3 className="text-xl font-semibold mb-2 text-center">Contact details</h3>
          <p className="text-sm text-center text-gray-200 mb-6">Leave your info and we’ll reply as soon as possible</p>

          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
                required
              />
              <FaUser className="absolute top-3.5 left-4 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
                required
              />
              <FaEnvelope className="absolute top-3.5 left-4 text-gray-500" />
            </div>
          </div>

          {/* Phone + Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="+31 6 123 45 678"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
              />
              <FaPhone className="absolute top-3.5 left-4 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type="text"
                name="company"
                placeholder="Company name"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
              />
              <FaBuilding className="absolute top-3.5 left-4 text-gray-500" />
            </div>
          </div>

          {/* Message */}
          <div>
            <textarea
              rows={4}
              name="message"
              placeholder="Your message..."
              className="w-full px-6 py-4 rounded-full bg-white text-black placeholder:text-gray-400 resize-none"
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      <CallToAction />
      <Footer />
    </>
  );
};
