import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  metaAPI,
} from "../lib/api";

/*
========================================
META CALLBACK
========================================
*/
export default function MetaCallback() {

  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const [status, setStatus] =
    useState("loading");

  const [message, setMessage] =
    useState(
      "Completing Meta connection..."
    );

  useEffect(() => {

    completeConnection();

  }, []);

  /*
  ========================================
  COMPLETE CONNECTION
  ========================================
  */
  const completeConnection =
    async () => {

      try {

        /*
        ====================================
        CHECK FOR ERROR
        ====================================
        */
        const error =
          searchParams.get("error");

        if (error) {

          setStatus("error");

          setMessage(
            searchParams.get("error_description") ||
            error
          );

          setTimeout(() => {

            navigate(
              "/app/integrations",
              {
                replace: true,
              }
            );

          }, 3000);

          return;
        }

        /*
        ====================================
        VERIFY CONNECTION
        ====================================
        */
        const result =
          await metaAPI.getStatus();

        if (
          result?.success &&
          result?.status?.meta_connected
        ) {

          setStatus(
            "success"
          );

          setMessage(
            "Meta account connected successfully!"
          );

        } else {

          setStatus(
            "error"
          );

          setMessage(
            "Meta connection could not be verified."
          );
        }

      } catch (err) {

        console.error(err);

        setStatus(
          "error"
        );

        setMessage(
          err.message ||
          "Failed to complete Meta connection."
        );

      } finally {

        setTimeout(() => {

          navigate(
            "/app/integrations",
            {
              replace: true,
            }
          );

        }, 2500);

      }
    };

  /*
  ========================================
  UI
  ========================================
  */
  return (

    <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="absolute top-[-150px] left-[-150px] w-[350px] h-[350px] bg-purple-600/20 blur-[160px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[350px] h-[350px] bg-blue-600/20 blur-[160px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-10 text-center">

        {
          status === "loading" && (

            <Loader2
              size={56}
              className="animate-spin text-purple-400 mx-auto mb-6"
            />

          )
        }

        {
          status === "success" && (

            <CheckCircle2
              size={56}
              className="text-green-400 mx-auto mb-6"
            />

          )
        }

        {
          status === "error" && (

            <AlertTriangle
              size={56}
              className="text-red-400 mx-auto mb-6"
            />

          )
        }

        <h1 className="text-3xl font-bold text-white mb-4">

          {
            status === "loading"
              ? "Connecting Meta..."
              : status === "success"
              ? "Connected Successfully"
              : "Connection Failed"
          }

        </h1>

        <p className="text-gray-400 leading-7">

          {message}

        </p>

        <p className="text-xs text-gray-500 mt-8">

          Redirecting to Integrations...

        </p>

      </div>

    </div>

  );
}