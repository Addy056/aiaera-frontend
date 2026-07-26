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

    <div className="relative min-h-screen overflow-hidden px-4 py-10 text-slate-900 md:px-6">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_35%)]" />

      <div className="relative z-10">

        {/* EXPIRED BANNER */}
        {subscriptionExpired && (

          <div className="mx-auto mb-8 flex max-w-5xl flex-col gap-4 rounded-3xl border border-red-200 bg-red-50 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">

                <AlertTriangle
                  size={20}
                  className="text-red-300"
                />

              </div>

              <div>

                <h3 className="mb-1 text-lg font-semibold text-red-700">

                  Subscription Expired

                </h3>

                <p className="text-sm text-red-600/80">

                  Your chatbot and automations are currently paused.
                  Renew your subscription to reactivate all features.

                </p>

              </div>

            </div>

          </div>

        )}

        {/* HEADER */}
        <div className="mb-14 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1">

            <Sparkles size={12} className="text-violet-600" />

            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">

              AI Automation Pricing

            </span>

          </div>

          <h1 className="mb-4 text-5xl font-semibold tracking-[-2px] text-slate-900 md:text-6xl">

            Simple Pricing

          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">

            Start your 7-day free trial and upgrade as your AI automation grows.

          </p>

        </div>

        {/* CURRENT PLAN */}
        {currentPlan && (

          <div className="max-w-md mx-auto mb-10">

            <div className="rounded-3xl border border-violet-200 bg-white p-5 text-center shadow-sm">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2">

                <Crown
                  size={14}
                  className="text-yellow-300"
                />

                <span className="text-sm font-medium text-violet-700">

                  CURRENT PLAN

                </span>

              </div>

              <h2 className="mb-2 text-3xl font-semibold uppercase tracking-wide text-slate-900">

                {currentPlan}

              </h2>

              <p className="text-sm text-slate-600">

                {subscriptionExpired
                  ? "Your plan has expired"
                  : "Your subscription is active"}

              </p>

            </div>

          </div>

        )}

        {/* ERROR */}
        {error && (

          <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-700">

            {error}

          </div>

        )}

        {/* PLANS */}
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">

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
        <div className="mx-auto mt-24 max-w-6xl">

          <div className="text-center mb-14">

            <h2 className="mb-4 text-4xl font-semibold text-slate-900">

              Why Businesses Choose AIAERA

            </h2>

            <p className="text-lg text-slate-600">

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
    `relative overflow-hidden rounded-[32px] border p-8 shadow-sm transition-all duration-300 hover:scale-[1.02] ${
      highlight
        ? "border-violet-200 bg-white shadow-[0_20px_50px_-24px_rgba(124,58,237,0.35)]"
        : "border-slate-200 bg-white"
    }`
  }
    >

      {/* BADGE */}
      {badge && (

        <div
  className={
    `absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] font-semibold ${
      highlight
        ? "bg-violet-600 text-white"
        : "bg-slate-100 text-slate-700"
    }`
  }
>

          {badge}

        </div>

      )}

      {/* CURRENT */}
      {current && (

        <div className="absolute left-5 top-5 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">

          ACTIVE

        </div>

      )}

      {/* ICON */}
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-600">

        {icon}

      </div>

      {/* TITLE */}
      <h3 className="mb-2 text-2xl font-semibold text-slate-900">

        {title}

      </h3>

      {/* PRICE */}
      <div className="flex items-end gap-1 mb-6">

        <span className="text-5xl font-semibold text-slate-900">

          {price}

        </span>

        <span className="mb-1 text-slate-500">

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
              className="flex items-center gap-3 text-sm text-slate-600"
            >

              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-50 text-violet-600">

                <Check
                  size={12}
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
  `flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-semibold transition-all ${
    highlight
      ? "bg-violet-600 text-white hover:bg-violet-700"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">

        {icon}

      </div>

      <h3 className="mb-3 text-xl font-semibold text-slate-900">

        {title}

      </h3>

      <p className="text-sm leading-relaxed text-slate-600">

        {desc}

      </p>

    </div>

  );
}