// src/pages/LandingPage.jsx
import Hero from "../components/landing/Hero";
import ValuePillars from "../components/landing/ValuePillars";
import Capabilities from "../components/landing/Capabilities";
import ProductPreview from "../components/landing/ProductPreview";
import UseCases from "../components/landing/UseCases";
import PricingPreview from "../components/landing/PricingPreview";
import FinalCTA from "../components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900">
      <Hero />
      <ValuePillars />
      <Capabilities />
      <ProductPreview />
      <UseCases />
      <PricingPreview />
      <FinalCTA />
    </div>
  );
}
