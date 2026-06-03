import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Crown,
  Globe,
  Rocket,
  AlertTriangle,
  Check,
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
        await supabase
          .auth
          .getSession();

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
  SAFE RESPONSE
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

          navigate(
            "/login"
          );

          return;
        }

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

        const data =
          await parseResponse(
            res
          );

        if (!res.ok) {

          throw new Error(
            data.error ||
            "Failed to create order"
          );
        }

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
            `${plan} Subscription`,

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

                await supabase
                  .auth
                  .refreshSession();

                navigate(
                  "/app/dashboard"
                );

              } catch (err) {

                console.error(
                  err
                );

                setError(
                  err.message
                );
              }
            },
        };

        const rzp =
          new window.Razorpay(
            options
          );

        rzp.on(
          "payment.failed",
          function (
            response
          ) {

            setError(
              response.error
                ?.description ||
              "Payment failed"
            );
          }
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

    <div className="min-h-screen bg-black text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-black text-center mb-12">

          Pricing

        </h1>

        {subscriptionExpired && (

          <div className="mb-8 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 flex items-center gap-3">

            <AlertTriangle
              className="text-red-400"
            />

            <p>

              Your subscription has expired.

            </p>

          </div>

        )}

        {error && (

          <div className="mb-8 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">

            {error}

          </div>

        )}

        <div className="grid md:grid-cols-3 gap-6">

          <PricingCard
            title="Free"
            price="₹0"
            icon={<Rocket />}
            features={[
              "Website Chatbot",
              "Lead Collection",
            ]}
            disabled
            buttonText="Included"
          />

          <PricingCard
            title="Basic"
            price="₹999"
            icon={<Globe />}
            features={[
              "Unlimited Leads",
              "Appointments",
              "3 Chatbots",
            ]}
            current={
              currentPlan ===
              "basic"
            }
            loading={
              loadingPlan ===
              "basic"
            }
            buttonText="Choose Basic"
            onClick={() =>
              handlePayment(
                "basic"
              )
            }
          />

          <PricingCard
            title="Pro"
            price="₹1999"
            icon={<Crown />}
            highlight
            features={[
              "WhatsApp",
              "Facebook",
              "Instagram",
              "Unlimited Chatbots",
            ]}
            current={
              currentPlan ===
              "pro"
            }
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
PRICING CARD
========================================
*/
function PricingCard({
  title,
  price,
  features,
  buttonText,
  onClick,
  loading,
  icon,
  current,
  disabled,
  highlight,
}) {

  return (

    <div
      className={`
        rounded-3xl
        p-8
        border
        ${
          highlight
            ? "border-purple-500 bg-purple-500/10"
            : "border-white/10 bg-white/[0.03]"
        }
      `}
    >

      <div className="mb-6">

        {icon}

      </div>

      <h2 className="text-3xl font-black mb-2">

        {title}

      </h2>

      <p className="text-5xl font-black mb-6">

        {price}

      </p>

      <div className="space-y-3 mb-8">

        {features.map(
          (
            feature,
            index
          ) => (

            <div
              key={index}
              className="flex items-center gap-2"
            >

              <Check
                size={16}
              />

              <span>

                {feature}

              </span>

            </div>

          )
        )}

      </div>

      <button
        onClick={onClick}
        disabled={
          disabled ||
          current ||
          loading
        }
        className="w-full h-12 rounded-2xl bg-[#7f5af0] font-semibold disabled:opacity-50"
      >

        {loading ? (

          <div className="flex items-center justify-center gap-2">

            <Loader2
              size={16}
              className="animate-spin"
            />

            Processing...

          </div>

        ) : current ? (

          "Current Plan"

        ) : (

          buttonText

        )}

      </button>

    </div>
  );
}