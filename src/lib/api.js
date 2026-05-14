import axios from "axios";

import { supabase }
  from "./supabase";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL,
});

/*
========================================
ATTACH AUTH TOKEN
========================================
*/
api.interceptors.request.use(
  async (config) => {

    const { data } =
      await supabase.auth.getSession();

    if (data.session) {

      config.headers.Authorization =
        `Bearer ${data.session.access_token}`;
    }

    return config;
  }
);

/*
========================================
INTEGRATIONS API
========================================
*/
export const integrationsAPI = {

  /*
  ========================================
  GET ALL INTEGRATIONS
  ========================================
  */
  getIntegrations:
    async () => {

      const res =
        await api.get(
          "/api/integrations"
        );

      return res.data;
    },

  /*
  ========================================
  SAVE INTEGRATIONS
  ========================================
  */
  saveIntegrations:
    async (payload) => {

      const res =
        await api.post(
          "/api/integrations",
          payload
        );

      return res.data;
    },

  /*
  ========================================
  TOGGLE AUTOMATION
  ========================================
  */
  toggleAutomation:
    async ({
      platform,
      enabled,
    }) => {

      const res =
        await api.patch(
          "/api/integrations/toggle",
          {
            platform,
            enabled,
          }
        );

      return res.data;
    },

  /*
  ========================================
  TEST CONNECTION
  ========================================
  */
  testConnection:
    async (platform) => {

      const res =
        await api.post(
          "/api/integrations/test",
          {
            platform,
          }
        );

      return res.data;
    },
};

/*
========================================
CHATBOT API
========================================
*/
export const chatbotAPI = {

  /*
  ========================================
  CREATE CHATBOT
  ========================================
  */
  create:
    async (payload) => {

      const res =
        await api.post(
          "/api/chatbot/create",
          payload
        );

      return res.data;
    },

  /*
  ========================================
  UPDATE CHATBOT
  ========================================
  */
  update:
    async (
      chatbotId,
      payload
    ) => {

      const res =
        await api.put(
          `/api/chatbot/${chatbotId}`,
          payload
        );

      return res.data;
    },
};

/*
========================================
LEADS API
========================================
*/
export const leadsAPI = {

  getLeads:
    async () => {

      const res =
        await api.get(
          "/api/leads"
        );

      return res.data;
    },
};

/*
========================================
APPOINTMENTS API
========================================
*/
export const appointmentsAPI = {

  getAppointments:
    async () => {

      const res =
        await api.get(
          "/api/appointments"
        );

      return res.data;
    },
};

/*
========================================
EXPORT AXIOS INSTANCE
========================================
*/
export default api;