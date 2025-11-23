// src/utils/razorpayLoader.js
export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    // Already loaded → return instantly
    if (window.Razorpay) {
      return resolve(true);
    }

    // Prevent duplicate injection
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.onload = () => resolve(true);
      existing.onerror = () => reject("Failed to load Razorpay");
      return;
    }

    // Create <script> tag
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    // Success
    script.onload = () => resolve(true);

    // Failure
    script.onerror = () => reject("Failed to load Razorpay library");

    // Timeout (Fail-safe)
    setTimeout(() => {
      if (!window.Razorpay) {
        reject("Razorpay load timeout");
      }
    }, 8000);

    // Inject into DOM
    document.body.appendChild(script);
  });
};
