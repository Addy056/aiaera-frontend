import {
  useEffect,
} from "react";

import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PricingSection from "../components/landing/PricingSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const Landing = () => {

  /*
  ========================================
  LOAD TEST CHATBOT
  ========================================
  */
  useEffect(() => {

    /*
    ========================================
    PREVENT DUPLICATE
    ========================================
    */
    if (
      document.getElementById(
        "aiaera-test-widget"
      )
    ) {
      return;
    }

    /*
    ========================================
    CREATE SCRIPT
    ========================================
    */
    const script =
      document.createElement(
        "script"
      );

    script.id =
      "aiaera-test-widget";

    script.src =
      "https://aiaera-backend.onrender.com/api/embed/6cffa8c2-93e8-41eb-84c0-573bec375622.js";

    script.async = true;

    document.body.appendChild(
      script
    );

    /*
    ========================================
    CLEANUP
    ========================================
    */
    return () => {

      script.remove();

      const iframe =
        document.getElementById(
          "aiaera-chatbot-widget"
        );

      const button =
        document.getElementById(
          "aiaera-chatbot-button"
        );

      if (iframe) {
        iframe.remove();
      }

      if (button) {
        button.remove();
      }
    };

  }, []);

  return (
    <div className="min-h-screen bg-[#05010d] text-white overflow-hidden">

      <Navbar />

      <HeroSection />

      <FeaturesSection />

      <PricingSection />

      <CTASection />

      <Footer />

    </div>
  );
};

export default Landing;