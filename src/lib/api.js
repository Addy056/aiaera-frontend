import axios from "axios";

import { supabase }
  from "./supabase";

/*
========================================
AXIOS INSTANCE
========================================
*/
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

      return (
        res.data?.integrations || {

          whatsapp_token: "",
          whatsapp_phone_id: "",
          whatsapp_enabled: false,

          facebook_page_id: "",
          facebook_page_token: "",
          facebook_enabled: false,

          instagram_business_id: "",
          instagram_access_token: "",
          instagram_enabled: false,

          provider: "calendly",
          meeting_link: "",

          maps: "",
        }
      );
    },

  /*
  ========================================
  SAVE INTEGRATIONS
  ========================================
  */
  saveIntegrations:
    async (payload) => {

      const cleanPayload = {

        whatsapp_token:
          payload.whatsapp_token || "",

        whatsapp_phone_id:
          payload.whatsapp_phone_id || "",

        whatsapp_enabled:
          payload.whatsapp_enabled || false,

        facebook_page_id:
          payload.facebook_page_id || "",

        facebook_page_token:
          payload.facebook_page_token || "",

        facebook_enabled:
          payload.facebook_enabled || false,

        instagram_business_id:
          payload.instagram_business_id || "",

        instagram_access_token:
          payload.instagram_access_token || "",

        instagram_enabled:
          payload.instagram_enabled || false,

        provider:
          payload.provider || "calendly",

        meeting_link:
          payload.meeting_link || "",

        maps:
          payload.maps || "",
      };

      const res =
        await api.post(
          "/api/integrations",
          cleanPayload
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

  /*
  ========================================
  GET APPOINTMENTS
  ========================================
  */
  getAppointments:
    async () => {

      const res =
        await api.get(
          "/api/appointments"
        );

      return res.data;
    },

  /*
  ========================================
  CREATE APPOINTMENT
  ========================================
  */
  createAppointment:
    async (payload) => {

      const res =
        await api.post(
          "/api/appointments",
          payload
        );

      return res.data;
    },

  /*
  ========================================
  UPDATE APPOINTMENT STATUS
  ========================================
  */
  updateAppointmentStatus:
    async (
      appointmentId,
      status,
      notes = ""
    ) => {

      const res =
        await api.patch(
          `/api/appointments/${appointmentId}/status`,
          {
            status,
            notes,
          }
        );

      return res.data;
    },

  /*
  ========================================
  DELETE APPOINTMENT
  ========================================
  */
  deleteAppointment:
    async (
      appointmentId
    ) => {

      const res =
        await api.delete(
          `/api/appointments/${appointmentId}`
        );

      return res.data;
    },

  /*
  ========================================
  APPOINTMENT STATS
  ========================================
  */
  getStats:
    async () => {

      const res =
        await api.get(
          "/api/appointments/stats"
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