import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const PricingPage: React.FC = () => (
  <>
    <Navbar />
    <div className="bg-gray-50 text-gray-900 font-sans py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Compare our subscription plans</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-400 text-gray-900">
                <th className="p-3 border border-gray-700 text-left">Feature</th>
                <th className="p-3 border border-gray-700">Starter<br /><span className="text-xs">(€65/month or €650/year)</span></th>
                <th className="p-3 border border-gray-700">Standard<br /><span className="text-xs">(€70/month or €700/year)</span></th>
                <th className="p-3 border border-gray-700">Professional<br /><span className="text-xs">(€85/month or €850/year  )</span></th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Tablet included", "❌ Rent for €12/mo", "✔ 1 tablet", "✔ 1+ tablets"],
                ["Dashboard & orders", "✔", "✔", "✔"],
                ["QR menu with custom logo", "✔", "✔", "✔"],
                ["Online payments", "✔", "✔", "✔"],
                ["Unlimited tables", "✔", "✔", "✔"],
                ["POS integration", "✔", "✔", "✔"],
                ["Printer integration", "✔", "✔", "✔"],
                ["Takeaway/delivery options", "✔", "✔", "✔"],
                ["Analytics & reports", "❌", "✔", "✔ advanced"],
                ["Export & reporting", "❌", "✔", "✔"],
                ["Multiple user accounts", "❌", "✔", "✔"],
                ["Upsell/cross-sell tools", "❌", "❌", "✔"],
                ["Full branding", "❌", "❌", "✔ (color, logo, style)"],
                ["Priority support", "❌", "❌", "✔ 24/7"],
                ["On-site installation", "❌", "❌", "✔ included"],
                ["Extra location", "€45/mo", "€35/mo", "Custom"],
                ["Trial period", "14 days free", "14 days free", "14 days free"]
              ].map(([feature, starter, standard, pro], i) => (
                <tr key={i}>
                  <td className="p-3 border border-gray-700">{feature}</td>
                  <td className="p-3 border border-gray-700">{starter}</td>
                  <td className="p-3 border border-gray-700">{standard}</td>
                  <td className="p-3 border border-gray-700">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <CallToAction />
    <Footer />
  </>
);
