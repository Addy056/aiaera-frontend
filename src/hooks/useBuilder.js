import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  fetchChatbots,
  saveChatbot,
} from "../api/chatbotApi";

import {
  fetchIntegrations,
} from "../api/integrationsApi";

/*
========================================
USE BUILDER
========================================
*/
export const useBuilder =
  (userId) => {

    /*
    ========================================
    STATES
    ========================================
    */
    const [
      chatbots,
      setChatbots,
    ] = useState([]);

    const [
      selectedChatbot,
      setSelectedChatbot,
    ] = useState(null);

    const [
      integrations,
      setIntegrations,
    ] = useState(null);

    const [loading, setLoading] =
      useState(true);

    const [saving, setSaving] =
      useState(false);

    const [error, setError] =
      useState(null);

    /*
    ========================================
    LOAD BUILDER DATA
    ========================================
    */
    const loadBuilderData =
      useCallback(
        async () => {

          /*
          ========================================
          SAFETY CHECK
          ========================================
          */
          if (!userId) {

            setLoading(
              false
            );

            return;
          }

          try {

            setLoading(
              true
            );

            setError(
              null
            );

            /*
            ========================================
            LOAD CHATBOTS
            ========================================
            */
            const {
              data: chatbotData,
              error: chatbotError,
            } =
              await fetchChatbots(
                userId
              );

            if (
              chatbotError
            ) {

              throw chatbotError;
            }

            /*
            ========================================
            SAVE CHATBOTS
            ========================================
            */
            setChatbots(
              chatbotData ||
                []
            );

            /*
            ========================================
            DEFAULT SELECT
            ========================================
            */
            if (
              chatbotData?.length >
              0
            ) {

              setSelectedChatbot(
                chatbotData[0]
              );
            }

            /*
            ========================================
            LOAD INTEGRATIONS
            ========================================
            */
            const {
              data:
                integrationData,
              error:
                integrationError,
            } =
              await fetchIntegrations(
                userId
              );

            if (
              integrationError
            ) {

              throw integrationError;
            }

            setIntegrations(
              integrationData ||
                null
            );

          } catch (err) {

            console.log(
              "BUILDER LOAD ERROR:",
              err
            );

            setError(
              err
            );

          } finally {

            setLoading(
              false
            );
          }
        },
        [userId]
      );

    /*
    ========================================
    INITIAL LOAD
    ========================================
    */
    useEffect(() => {

      loadBuilderData();

    }, [loadBuilderData]);

    /*
    ========================================
    SAVE BUILDER
    ========================================
    */
    const handleSaveChatbot =
      async (
        chatbotPayload
      ) => {

        /*
        ========================================
        SAFETY CHECK
        ========================================
        */
        if (!userId) {

          console.log(
            "NO USER ID"
          );

          return;
        }

        try {

          setSaving(
            true
          );

          setError(
            null
          );

          /*
          ========================================
          PREPARE DATA
          ========================================
          */
          const payload =
            {

              ...chatbotPayload,

              user_id:
                userId,
            };

          /*
          ========================================
          SAVE CHATBOT
          ========================================
          */
          const {
            data,
            error,
          } =
            await saveChatbot(
              payload
            );

          if (error) {

            throw error;
          }

          /*
          ========================================
          UPDATE STATE
          ========================================
          */
          setSelectedChatbot(
            data
          );

          /*
          ========================================
          RELOAD LIST
          ========================================
          */
          await loadBuilderData();

          return data;

        } catch (err) {

          console.log(
            "SAVE CHATBOT ERROR:",
            err
          );

          setError(
            err
          );

          throw err;

        } finally {

          setSaving(
            false
          );
        }
      };

    /*
    ========================================
    RETURN
    ========================================
    */
    return {

      /*
      ========================================
      STATES
      ========================================
      */
      chatbots,

      selectedChatbot,

      integrations,

      loading,

      saving,

      error,

      /*
      ========================================
      SETTERS
      ========================================
      */
      setChatbots,

      setSelectedChatbot,

      setIntegrations,

      /*
      ========================================
      ACTIONS
      ========================================
      */
      loadBuilderData,

      handleSaveChatbot,
    };
  };