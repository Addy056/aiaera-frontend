import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Check,
  Loader2,
  Sparkles,
  Crown,
  Rocket,
  ShieldCheck,
  Globe,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Clock3,
  Zap,
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

  const [
    currentPlan,
    setCurrentPlan,
  ] = useState(null);

  const [
    subscriptionExpired,
    setSubscriptionExpired,
  ] = useState(false);

  /*
  ========================================
  LOAD SUBSCRIPTION
  ========================================
  */
  useEffect(() => {

    fetchSubscription();

  }, [user]);

  const fetchSubscription =
    async () => {

      try {

        if (!user)
          return;

        const {
          data,
        } =
          await supabase
            .from(
              "user_subscriptions"
            )
            .select("*")
            .eq(
              "user_id",
              user.id
            )
            .maybeSingle();

        if (data) {

          setCurrentPlan(
            data.plan
          );

          const expired =
            data.expires_at
              ? new Date(
                  data.expires_at
                ) <
                new Date()
              : true;

          setSubscriptionExpired(
            expired
          );
        }

      } catch (err) {

        console.error(err);

      }
    };

  /*
  ========================================
  AUTH HEADERS
  ========================================
  */
  const getAuthHeaders =
    async () => {

      const { data } =
        await supabase.auth.getSession();

      if (
        !data.session
      ) {

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

        return JSON.parse(
          text
        );

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

          navigate(
            "/login"
          );

          return;
        }

        setLoadingPlan(
          plan
        );

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
              method:
                "POST",

              headers,

              body:
                JSON.stringify({
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
  text || "Failed to create order"
);
        }

        const data =
          await parseResponse(
            res
          );

        /*
        ========================================
        RAZORPAY
        ========================================
        */
        const options = {

          key: data.key,

          amount:
            data.amount,

          currency:
            "INR",

          name:
            "AIAERA",

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

                await supabase.auth.refreshSession();

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

        const rzp =
          new window.Razorpay(
            options
          );

        rzp.open();

      } catch (err) {

        console.error(
          err
        );

        setError(
          err.message ||
            "Payment failed"
        );

      } finally {

        setLoadingPlan(
          null
        );

      }
    };

  return (

    <div className="min-h-screen text-white px-4 md:px-6 py-10 overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-purple-600/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-blue-600/20 blur-[140px] rounded-full"></div>

      <div className="relative z-10">

        {/* EXPIRED BANNER */}
        {subscriptionExpired && (

          <div className="max-w-5xl mx-auto mb-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">

                <AlertTriangle
                  size={20}
                  className="text-red-300"
                />

              </div>

              <div>

                <h3 className="text-lg font-semibold text-red-200 mb-1">

                  Subscription Expired

                </h3>

                <p className="text-sm text-red-100/80">

                  Your chatbot and automations are currently paused.
                  Renew your subscription to reactivate all features.

                </p>

              </div>

            </div>

          </div>

        )}

        {/* HEADER */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-4">

            <Sparkles
              size={12}
              className="text-purple-400"
            />

            <span className="text-xs text-gray-300">

              AI Automation Pricing

            </span>

          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-[-2px]">

            Simple Pricing

          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">

            Start your 7-day free trial and upgrade as your AI automation grows.

          </p>

        </div>

        {/* CURRENT PLAN */}
        {currentPlan && (

          <div className="max-w-md mx-auto mb-10">

            <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#7f5af0]/20 to-blue-500/10 p-5 text-center">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-4">

                <Crown
                  size={14}
                  className="text-yellow-300"
                />

                <span className="text-sm font-medium">

                  CURRENT PLAN

                </span>

              </div>

              <h2 className="text-3xl font-black uppercase mb-2">

                {currentPlan}

              </h2>

              <p className="text-sm text-gray-300">

                {subscriptionExpired
                  ? "Your plan has expired"
                  : "Your subscription is active"}

              </p>

            </div>

          </div>

        )}

        {/* ERROR */}
        {error && (

          <div className="max-w-xl mx-auto mb-8 bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl text-sm text-center backdrop-blur-xl">

            {error}

          </div>

        )}

        {/* PLANS */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* TRIAL */}
          <PricingCard
            icon={
              <Rocket size={22} />
            }
            title="Free Trial"
            price="₹0"
            subtitle="7 Days"
            badge="START HERE"
            features={[
              "Website AI Chatbot",
              "Lead Collection",
              "Appointment Booking",
              "Multi-language AI",
              "File Upload Training",
              "200 AI Messages",
            ]}
            buttonText="Start Free Trial"
            disabled={
              currentPlan ===
              "trial"
            }
            loading={
              loadingPlan ===
              "trial"
            }
            trial
          />

          {/* BASIC */}
          <PricingCard
            title="Basic"
            icon={
              <Globe size={22} />
            }
            price="₹999"
            subtitle="/month"
            features={[
              "Website AI Chatbot",
              "Unlimited Leads",
              "Appointment Booking",
              "Multi-language AI",
              "3 Chatbots",
              "2,000 AI Messages",
              "Remove AIAERA Branding",
            ]}
            current={
              currentPlan ===
              "basic"
            }
            loading={
              loadingPlan ===
              "basic"
            }
            buttonText={
              currentPlan ===
              "basic"
                ? "Current Plan"
                : "Choose Basic"
            }
            onClick={() =>
              handlePayment(
                "basic"
              )
            }
          />

          {/* PRO */}
          <PricingCard
            highlight
            badge="MOST POPULAR"
            icon={
              <Crown size={22} />
            }
            title="Pro"
            price="₹1999"
            subtitle="/month"
            features={[
              "Everything In Basic",
              "WhatsApp Automation",
              "Facebook Automation",
              "Instagram Automation",
              "Advanced AI Automation",
              "Unlimited Chatbots",
              "10,000+ AI Messages",
              "Priority Support",
            ]}
            current={
              currentPlan ===
              "pro"
            }
            loading={
              loadingPlan ===
              "pro"
            }
            buttonText={
              currentPlan ===
              "pro"
                ? "Current Plan"
                : "Go Pro"
            }
            onClick={() =>
              handlePayment(
                "pro"
              )
            }
          />

        </div>

        {/* FEATURES SECTION */}
        <div className="max-w-6xl mx-auto mt-24">

          <div className="text-center mb-14">

            <h2 className="text-4xl font-black mb-4">

              Why Businesses Choose AIAERA

            </h2>

            <p className="text-gray-400 text-lg">

              Powerful AI automation built for modern businesses.

            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <FeatureBox
              icon={
                <MessageSquare
                  size={20}
                />
              }
              title="AI Conversations"
              desc="Engage customers with intelligent AI responses across channels."
            />

            <FeatureBox
              icon={
                <Calendar
                  size={20}
                />
              }
              title="Appointments"
              desc="Automate bookings and capture leads instantly."
            />

            <FeatureBox
              icon={
                <ShieldCheck
                  size={20}
                />
              }
              title="Business Automation"
              desc="Scale support, lead generation, and customer communication."
            />

          </div>

        </div>

      </div>

    </div>
  );
}

/*
========================================
PRICING CARD
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
  badge,
  current,
  disabled,
  trial,
}) {

  return (

    <div
  className={
    `relative rounded-[32px] p-8 border overflow-hidden backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] ${
      highlight
        ? "bg-gradient-to-br from-[#7f5af0]/30 to-[#9f7aea]/10 border-purple-500/30 shadow-[0_0_50px_rgba(127,90,240,0.25)]"
        : "bg-white/[0.03] border-white/10"
    }`
  }
    >

      {/* BADGE */}
      {badge && (

        <div
  className={
    `absolute top-5 right-5 text-[10px] px-3 py-1 rounded-full font-semibold ${
      highlight
        ? "bg-purple-500 text-white"
        : "bg-white/10 text-gray-200"
    }`
  }
>

          {badge}

        </div>

      )}

      {/* CURRENT */}
      {current && (

        <div className="absolute top-5 left-5 text-[10px] px-3 py-1 rounded-full bg-green-500 text-white font-semibold">

          ACTIVE

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
          (
            feature,
            index
          ) => (

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
        disabled={
          loading ||
          current ||
          disabled ||
          trial
        }
        className={
  `w-full h-12 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
    highlight
      ? "bg-[#7f5af0] hover:opacity-90"
      : "bg-white/[0.05] hover:bg-white/[0.08]"
  } ${
    current ||
    disabled ||
    trial
      ? "opacity-60 cursor-not-allowed"
      : ""
  }`
}
      >

        {loading ? (

          <>
            <Loader2
              size={16}
              className="animate-spin"
            />

            Processing...

          </>

        ) : current ? (

          "Current Plan"

        ) : trial ? (

          <>
            <Clock3 size={16} />
            Included During Signup
          </>

        ) : (

          buttonText

        )}

      </button>

    </div>

  );
}

/*
========================================
FEATURE BOX
========================================
*/
function FeatureBox({
  icon,
  title,
  desc,
}) {

  return (

    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5 text-purple-300">

        {icon}

      </div>

      <h3 className="text-xl font-bold mb-3">

        {title}

      </h3>

      <p className="text-gray-400 leading-relaxed text-sm">

        {desc}

      </p>

    </div>

  );
}