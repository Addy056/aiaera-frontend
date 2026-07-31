import {
  useEffect,
} from "react";

import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PricingSection from "../components/landing/PricingSection";
import Footer from "../components/landing/Footer";

const Landing = () => {

  /*
  ========================================
  LOAD DEMO CHATBOT
  ========================================
  */
  useEffect(() => {

    /*
    ========================================
    REMOVE OLD INSTANCES
    ========================================
    */
    const oldScript =
      document.getElementById(
        "aiaera-demo-widget-script"
      );

    const oldIframe =
      document.getElementById(
        "aiaera-chatbot-widget"
      );

    const oldButton =
      document.getElementById(
        "aiaera-chatbot-button"
      );

    if (oldScript) {
      oldScript.remove();
    }

    if (oldIframe) {
      oldIframe.remove();
    }

    if (oldButton) {
      oldButton.remove();
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
      "aiaera-demo-widget-script";

    script.src =
"https://aiaera-backend.onrender.com/api/embed/948a5f26-0bad-4856-9e9b-37202c4f65cd.js";
    script.async = true;

    script.onload =
      () => {

        console.log(
          "AIAERA demo chatbot loaded"
        );

      };

    script.onerror =
      () => {

        console.error(
          "Failed to load chatbot widget"
        );

      };

    document.body.appendChild(
      script
    );

    /*
    ========================================
    CLEANUP
    ========================================
    */
    return () => {

      const widgetScript =
        document.getElementById(
          "aiaera-demo-widget-script"
        );

      const widgetIframe =
        document.getElementById(
          "aiaera-chatbot-widget"
        );

      const widgetButton =
        document.getElementById(
          "aiaera-chatbot-button"
        );

      if (widgetScript) {
        widgetScript.remove();
      }

      if (widgetIframe) {
        widgetIframe.remove();
      }

      if (widgetButton) {
        widgetButton.remove();
      }

    };

  }, []);

  return (

    <div className="min-h-screen bg-[#05010d] text-white overflow-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <HeroSection />

      {/* FEATURES */}
      <FeaturesSection />

      {/* PRICING */}
      <PricingSection />

     

      {/* FOOTER */}
      <Footer />

    </div>

  );
};

export default Landing;