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

          if (!userId) {

            setChatbots([]);
            setSelectedChatbot(null);
            setIntegrations(null);
            setLoading(false);

            return;
          }

          try {

            setLoading(true);
            setError(null);

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

            const safeChatbots =
              Array.isArray(
                chatbotData
              )
                ? chatbotData
                : [];

            setChatbots(
              safeChatbots
            );

            /*
            ========================================
            KEEP CURRENT CHATBOT
            ========================================
            */
            if (
              safeChatbots.length >
              0
            ) {

              setSelectedChatbot(
                (prev) => {

                  if (
                    prev
                  ) {

                    const existing =
                      safeChatbots.find(
                        (
                          chatbot
                        ) =>
                          chatbot.id ===
                          prev.id
                      );

                    if (
                      existing
                    ) {

                      return existing;
                    }
                  }

                  return (
                    safeChatbots[0]
                  );
                }
              );

            } else {

              setSelectedChatbot(
                null
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

              console.error(
                "INTEGRATION ERROR:",
                integrationError
              );

            } else {

              setIntegrations(
                integrationData ||
                  null
              );
            }

          } catch (err) {

            console.error(
              "BUILDER LOAD ERROR:",
              err
            );

            setError(err);

          } finally {

            setLoading(false);
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

      let mounted =
        true;

      const load =
        async () => {

          if (
            !mounted
          ) return;

          await loadBuilderData();
        };

      load();

      return () => {

        mounted =
          false;
      };

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

        if (!userId) {

          console.error(
            "NO USER ID"
          );

          return null;
        }

        try {

          setSaving(true);
          setError(null);

          const payload =
            {
              ...chatbotPayload,
              user_id:
                userId,
            };

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

          setSelectedChatbot(
            data
          );

          await loadBuilderData();

          return data;

        } catch (err) {

          console.error(
            "SAVE CHATBOT ERROR:",
            err
          );

          setError(err);

          throw err;

        } finally {

          setSaving(false);
        }
      };

    /*
    ========================================
    RETURN
    ========================================
    */
    return {

      chatbots,

      selectedChatbot,

      integrations,

      loading,

      saving,

      error,

      setChatbots,

      setSelectedChatbot,

      setIntegrations,

      loadBuilderData,

      handleSaveChatbot,
    };
  };