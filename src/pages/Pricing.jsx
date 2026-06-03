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
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { AuthContext }
  from "../context/AuthContext";

import { supabase }
  from "../lib/supabase";

const API_URL =
  import.meta.env
    .VITE_API_URL;

export default function Pricing() {

  const { user } =
    useContext(
      AuthContext
    );

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
          error,
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

        if (error) {

          console.error(
            "SUBSCRIPTION ERROR:",
            error
          );

          return;
        }

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

        console.error(
          "FETCH SUBSCRIPTION ERROR:",
          err
        );
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

        /*
        ========================================
        USER CHECK
        ========================================
        */
        if (!user) {

          alert(
            "Please login first"
          );

          navigate(
            "/login"
          );

          return;
        }

        /*
        ========================================
        RAZORPAY SDK CHECK
        ========================================
        */
        if (
          !window.Razorpay
        ) {

          setError(
            "Razorpay SDK failed to load"
          );

          return;
        }

        setLoadingPlan(
          plan
        );

        setError("");

        /*
        ========================================
        AUTH HEADERS
        ========================================
        */
        const headers =
          await getAuthHeaders();

        /*
        ========================================
        CREATE ORDER
        ========================================
        */
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

        /*
        ========================================
        SAFE RESPONSE
        ========================================
        */
        const data =
          await parseResponse(
            res
          );

        /*
        ========================================
        BACKEND ERROR
        ========================================
        */
        if (!res.ok) {

          console.error(
            "PAYMENT API ERROR:",
            data
          );

          throw new Error(
            data.error ||
            "Failed to create order"
          );
        }

        /*
        ========================================
        VALIDATE RESPONSE
        ========================================
        */
        if (
          !data.orderId ||
          !data.key
        ) {

          throw new Error(
            "Invalid payment response"
          );
        }

        /*
        ========================================
        RAZORPAY OPTIONS
        ========================================
        */
        const options = {

          key:
            data.key,

          amount:
            data.amount,

          currency:
            data.currency ||
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

          modal: {

            ondismiss:
              function () {

                console.log(
                  "Payment popup closed"
                );

                setLoadingPlan(
                  null
                );
              },
          },

          /*
          ========================================
          PAYMENT SUCCESS
          ========================================
          */
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

                /*
                ========================================
                VERIFY ERROR
                ========================================
                */
                if (
                  !verifyRes.ok
                ) {

                  throw new Error(
                    verifyData.error ||
                    "Verification failed"
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
                SUCCESS
                ========================================
                */
                navigate(
                  "/app/dashboard"
                );

              } catch (err) {

                console.error(
                  "VERIFY ERROR:",
                  err
                );

                setError(
                  err.message ||
                  "Payment verification failed"
                );
              }
            },
        };

        /*
        ========================================
        CREATE INSTANCE
        ========================================
        */
        const rzp =
          new window.Razorpay(
            options
          );

        /*
        ========================================
        PAYMENT FAILED
        ========================================
        */
        rzp.on(
          "payment.failed",
          function (
            response
          ) {

            console.error(
              "PAYMENT FAILED:",
              response
            );

            setError(
              response.error
                ?.description ||
              "Payment failed"
            );
          }
        );

        /*
        ========================================
        OPEN PAYMENT
        ========================================
        */
        rzp.open();

      } catch (err) {

        console.error(
          "PAYMENT ERROR:",
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

      </div>

    </div>
  );
}