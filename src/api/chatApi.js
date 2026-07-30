/*
========================================
CHAT API
========================================
*/

import {
  API_ENDPOINTS,
} from "../constants/chatConstants";

const API_URL =
  import.meta.env.VITE_API_URL;

/*
========================================
HANDLE RESPONSE
========================================
*/
const handleResponse =
  async (response) => {

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
        data?.message ||
        "Request failed."
      );
    }

    return data;
  };

/*
========================================
FETCH PUBLIC CHATBOT
========================================
*/
export const fetchPublicChatbot =
  async (
    chatbotId,
    signal
  ) => {

    const response =
      await fetch(
        `${API_URL}${API_ENDPOINTS.PUBLIC_CHATBOT}/${chatbotId}`,
        {
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

/*
========================================
PUBLIC CHAT MESSAGE
========================================
*/
export const sendPublicMessage =
  async ({
    chatbotId,
    visitorId,
    message,
    messages,
    signal,
  }) => {

    const response =
      await fetch(
        `${API_URL}${API_ENDPOINTS.CHAT}`,
        {
          method: "POST",

          signal,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            chatbotId,
            visitorId,
            message,
            messages,
          }),
        }
      );

    return handleResponse(
      response
    );
  };

/*
========================================
BUILDER PREVIEW MESSAGE
========================================
*/
export const sendPreviewMessage =
  async ({
    chatbotId,
    sessionId,
    message,
    accessToken,
    signal,
  }) => {

    const response =
      await fetch(
        `${API_URL}${API_ENDPOINTS.CHAT}`,
        {
          method: "POST",

          signal,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${accessToken}`,
          },

          body: JSON.stringify({
            chatbot_id:
              chatbotId,

            session_id:
              sessionId,

            message,
          }),
        }
      );

    return handleResponse(
      response
    );
  };