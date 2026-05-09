import {
  useContext,
  useState,
} from "react";

import {
  Check,
  Loader2,
  Sparkles,
  Crown,
  Rocket,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { supabase } from "../lib/supabase";

const API_URL =
  import.meta.env.VITE_API_URL;

export default function Pricing() {

  const { user } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const [
    loadingPlan,
    setLoadingPlan,
  ] = useState(null);

  const [error, setError] =
    useState("");

  /*
  ========================================
  AUTH HEADERS
  ========================================
  */
  const getAuthHeaders =
    async () => {

      const { data } =
        await supabase.auth.getSession();

      if (!data.session) {
        throw new Error(
          "User not authenticated"
        );
      }

      return {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${data.session.access_token}`,
      };
    };

  /*
  ========================================
  SAFE RESPONSE PARSER
  ========================================
  */
  const parseResponse =
    async (res) => {

      const text =
        await res.text();

      try {

        return JSON.parse(text);

      } catch {

        console.error(
          "INVALID SERVER RESPONSE:",
          text
        );

        throw new Error(
          "Invalid server response"
        );
      }
    };

  /*
  ========================================
  HANDLE PAYMENT
  ========================================
  */
  const handlePayment =
    async (plan) => {

      try {

        if (!user) {
          alert(
            "Please login first"
          );

          navigate("/login");

          return;
        }

        setLoadingPlan(plan);

        setError("");

        /*
        ========================================
        CREATE ORDER
        ========================================
        */
        const headers =
          await getAuthHeaders();

        const res =
          await fetch(
            `${API_URL}/api/payment/create-order`,
            {
              method: "POST",

              headers,

              body: JSON.stringify({
                plan,
              }),
            }
          );

        if (!res.ok) {

          const text =
            await res.text();

          console.error(
            "PAYMENT API ERROR:",
            text
          );

          throw new Error(
            "Failed to create order"
          );
        }

        const data =
          await parseResponse(
            res
          );

        /*
        ========================================
        RAZORPAY OPTIONS
        ========================================
        */
        const options = {

          key: data.key,

          amount:
            data.amount,

          currency: "INR",

          name: "AIAERA",

          description:
            `${plan} subscription`,

          order_id:
            data.orderId,

          theme: {
            color:
              "#7f5af0",
          },

          handler:
            async function (
              response
            ) {

              try {

                const verifyHeaders =
                  await getAuthHeaders();

                const verifyRes =
                  await fetch(
                    `${API_URL}/api/payment/verify`,
                    {
                      method:
                        "POST",

                      headers:
                        verifyHeaders,

                      body:
                        JSON.stringify({
                          ...response,
                          plan,
                        }),
                    }
                  );

                const verifyData =
                  await parseResponse(
                    verifyRes
                  );

                if (
                  !verifyRes.ok
                ) {

                  throw new Error(
                    verifyData.error
                  );
                }

                /*
                ========================================
                REFRESH SESSION
                ========================================
                */
                await supabase.auth.refreshSession();

                /*
                ========================================
                REDIRECT
                ========================================
                */
                navigate(
                  "/app/dashboard"
                );

              } catch (err) {

                console.error(
                  err
                );

                setError(
                  "Payment verification failed"
                );
              }
            },
        };

        /*
        ========================================
        OPEN RAZORPAY
        ========================================
        */
        const rzp =
          new window.Razorpay(
            options
          );

        rzp.open();

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Payment failed"
        );

      } finally {

        setLoadingPlan(null);

      }
    };

  /*
  ========================================
  FREE PLAN
  ========================================
  */
  const handleFreePlan =
    async () => {

      try {

        if (!user) {

          alert(
            "Please login first"
          );

          navigate("/login");

          return;
        }

        setLoadingPlan(
          "free"
        );

        const expiresAt =
          new Date();

        expiresAt.setDate(
          expiresAt.getDate() + 7
        );

        /*
        ========================================
        UPSERT SUBSCRIPTION
        ========================================
        */
        const { error } =
          await supabase
            .from(
              "user_subscriptions"
            )
            .upsert({
              user_id:
                user.id,

              plan:
                "free",

              expires_at:
                expiresAt.toISOString(),
            });

        if (error) {
          throw error;
        }

        await supabase.auth.refreshSession();

        navigate(
          "/app/dashboard"
        );

      } catch (err) {

        console.error(err);

        setError(
          "Failed to activate trial"
        );

      } finally {

        setLoadingPlan(null);

      }
    };

  return (
    <div className="min-h-screen text-white px-4 md:px-6 py-10 overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-purple-600/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-blue-600/20 blur-[140px] rounded-full"></div>

      <div className="relative z-10">

        {/* HEADER */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-4">

            <Sparkles
              size={12}
              className="text-purple-400"
            />

            <span className="text-xs text-gray-300">
              Flexible Pricing
            </span>

          </div>

          <h1 className="text-5xl font-black mb-4">
            Simple Pricing
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start with a free trial and upgrade anytime as your business grows.
          </p>

        </div>

        {/* ERROR */}
        {error && (

          <div className="max-w-xl mx-auto mb-8 bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl text-sm text-center backdrop-blur-xl">

            {error}

          </div>
        )}

        {/* PLANS */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          <PricingCard
            icon={
              <Rocket size={20} />
            }
            title="Free Trial"
            price="₹0"
            subtitle="7 Days Access"
            features={[
              "AI Chatbot Builder",
              "Leads Collection",
              "Appointments",
              "WhatsApp Automation",
              "Website Integration",
              "All Features Included",
            ]}
            buttonText="Start Free Trial"
            loading={
              loadingPlan ===
              "free"
            }
            onClick={
              handleFreePlan
            }
          />

          <PricingCard
            title="Basic"
            icon={
              <Sparkles size={20} />
            }
            price="₹999"
            subtitle="/month"
            features={[
              "Website Chatbot",
              "Lead Collection",
              "Basic Automation",
              "Website Integration",
              "No WhatsApp Support",
            ]}
            loading={
              loadingPlan ===
              "basic"
            }
            buttonText="Choose Plan"
            onClick={() =>
              handlePayment(
                "basic"
              )
            }
          />

          <PricingCard
            highlight
            icon={
              <Crown size={20} />
            }
            title="Pro"
            price="₹1999"
            subtitle="/month"
            features={[
              "Everything in Basic",
              "WhatsApp Automation",
              "Facebook & Instagram",
              "Advanced AI Responses",
              "Priority Features",
              "Premium Support",
            ]}
            loading={
              loadingPlan ===
              "pro"
            }
            buttonText="Go Pro"
            onClick={() =>
              handlePayment(
                "pro"
              )
            }
          />

        </div>

      </div>

    </div>
  );
}

/*
========================================
CARD
========================================
*/

function PricingCard({
  title,
  price,
  subtitle,
  features,
  buttonText,
  onClick,
  highlight,
  loading,
  icon,
}) {

  return (
    <div
      className={`relative rounded-[32px] p-8 border overflow-hidden backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] ${
        highlight
          ? "bg-gradient-to-br from-[#7f5af0]/30 to-[#9f7aea]/10 border-purple-500/30 shadow-[0_0_50px_rgba(127,90,240,0.25)]"
          : "bg-white/[0.03] border-white/10"
      }`}
    >

      {/* TOP BADGE */}
      {highlight && (

        <div className="absolute top-5 right-5 text-[10px] px-3 py-1 rounded-full bg-purple-500 text-white font-semibold">

          MOST POPULAR

        </div>
      )}

      {/* ICON */}
      <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6">

        {icon}

      </div>

      {/* TITLE */}
      <h3 className="text-2xl font-bold mb-2">
        {title}
      </h3>

      {/* PRICE */}
      <div className="flex items-end gap-1 mb-6">

        <span className="text-5xl font-black">
          {price}
        </span>

        <span className="text-gray-400 mb-1">
          {subtitle}
        </span>

      </div>

      {/* FEATURES */}
      <div className="space-y-4 mb-8">

        {features.map(
          (feature, index) => (

            <div
              key={index}
              className="flex items-center gap-3 text-sm text-gray-300"
            >

              <div className="w-5 h-5 rounded-full bg-purple-500/15 flex items-center justify-center">

                <Check
                  size={12}
                  className="text-purple-300"
                />

              </div>

              <span>
                {feature}
              </span>

            </div>
          )
        )}

      </div>

      {/* BUTTON */}
      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full h-12 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
          highlight
            ? "bg-[#7f5af0] hover:opacity-90"
            : "bg-white/[0.05] hover:bg-white/[0.08]"
        }`}
      >

        {loading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />

            Processing...
          </>
        ) : (
          buttonText
        )}

      </button>

    </div>
  );
}