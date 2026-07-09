import axios from "axios";

import { supabase } from "./supabase";

const API_TIMEOUT_MS = 20000;

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const defaultIntegrations = {
  whatsapp_access_token: "",
  whatsapp_phone_id: "",
  whatsapp_enabled: false,
  facebook_page_id: "",
  facebook_page_access_token: "",
  facebook_enabled: false,
  instagram_business_id: "",
  instagram_access_token: "",
  instagram_enabled: false,
  meeting_provider: "calendly",
  meeting_link: "",
  maps_link: "",
};

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
});

export const getAuthHeaders = async (
  contentType = "application/json"
) => {
  const { data } =
    await supabase.auth.getSession();

  if (!data.session?.access_token) {
    throw new Error("User not authenticated");
  }

  const headers = {
    Authorization:
      `Bearer ${data.session.access_token}`,
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
};

api.interceptors.request.use(
  async (config) => {
    const { data } =
      await supabase.auth.getSession();

    if (data.session?.access_token) {
      config.headers.Authorization =
        `Bearer ${data.session.access_token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status =
      error.response?.status;

    if (status === 401) {
      await supabase.auth.signOut();
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : error.message) ||
      "Request failed";

    const normalizedError =
      new Error(message);

    normalizedError.status =
      status || 0;

    normalizedError.data =
      error.response?.data || null;

    throw normalizedError;
  }
);

const parseBlobError = async (blob) => {
  const text =
    await blob.text();

  try {
    const data =
      JSON.parse(text);

    return (
      data.error ||
      data.message ||
      "Request failed"
    );
  } catch {
    return text || "Request failed";
  }
};

const normalizeIntegrations =
  (integrations) => ({
    ...defaultIntegrations,
    ...(integrations || {}),
  });

export const subscriptionAPI = {
  getSubscription:
    async () => {
      const res =
        await api.get(
          "/api/payment/subscription"
        );

      return res.data;
    },

  createOrder:
    async (plan) => {
      const res =
        await api.post(
          "/api/payment/create-order",
          { plan }
        );

      return res.data;
    },

  verifyPayment:
    async (payload) => {
      const res =
        await api.post(
          "/api/payment/verify",
          payload
        );

      return res.data;
    },

  cancel:
    async () => {
      const res =
        await api.post(
          "/api/payment/cancel"
        );

      return res.data;
    },
};

export const integrationsAPI = {
  getIntegrations:
    async () => {
      const res =
        await api.get(
          "/api/integrations"
        );

      return normalizeIntegrations(
        res.data?.integrations
      );
    },

  getStatus:
    async () => {
      const res =
        await api.get(
          "/api/integrations/status"
        );

      return res.data;
    },

  saveIntegrations:
  async (payload) => {

    const cleanPayload = {

      /*
      ====================================
      WHATSAPP
      ====================================
      */
      whatsapp_access_token:
        payload.whatsapp_access_token || "",

      whatsapp_phone_id:
        payload.whatsapp_phone_id || "",

      whatsapp_enabled:
        Boolean(
          payload.whatsapp_enabled
        ),

      /*
      ====================================
      FACEBOOK
      ====================================
      OAuth manages tokens & page IDs
      ====================================
      */
      facebook_enabled:
        Boolean(
          payload.facebook_enabled
        ),

      /*
      ====================================
      INSTAGRAM
      ====================================
      OAuth manages tokens & business IDs
      ====================================
      */
      instagram_enabled:
        Boolean(
          payload.instagram_enabled
        ),

      /*
      ====================================
      MEETING
      ====================================
      */
      meeting_provider:
        payload.meeting_provider ||
        "calendly",

      meeting_link:
        payload.meeting_link || "",

      /*
      ====================================
      BUSINESS LOCATION
      ====================================
      */
      maps_link:
        payload.maps_link || "",
    };

    const res =
      await api.post(
        "/api/integrations",
        cleanPayload
      );

    return res.data;
  },

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

  testConnection:
    async (platform) => {
      const res =
        await api.post(
          "/api/integrations/test",
          { platform }
        );

      return res.data;
    },

  deleteIntegration:
    async (platform) => {
      const res =
        await api.delete(
          `/api/integrations/${platform}`
        );

      return res.data;
    },
};

export const metaAPI = {
  getConnectUrl:
    async (returnTo) => {
      const res =
        await api.get(
          "/api/meta/connect",
          {
            params: returnTo
              ? { returnTo }
              : {},
          }
        );

      return res.data;
    },

  getStatus:
    async () => {
      const res =
        await api.get(
          "/api/meta/status"
        );

      return res.data;
    },

  sync:
    async () => {
      const res =
        await api.post(
          "/api/meta/sync"
        );

      return res.data;
    },

  disconnect:
    async () => {
      const res =
        await api.delete(
          "/api/meta/disconnect"
        );

      return res.data;
    },
};

export const chatbotAPI = {
  create:
    async (payload) => {
      const res =
        await api.post(
          "/api/chatbot/create",
          payload
        );

      return res.data;
    },

  getAll:
    async () => {
      const res =
        await api.get(
          "/api/chatbot/user/all"
        );

      return res.data;
    },

  get:
    async (chatbotId) => {
      const res =
        await api.get(
          `/api/chatbot/${chatbotId}`
        );

      return res.data;
    },

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

  delete:
    async (chatbotId) => {
      const res =
        await api.delete(
          `/api/chatbot/${chatbotId}`
        );

      return res.data;
    },

  scrape:
    async (payload) => {
      const res =
        await api.post(
          "/api/chatbot/scrape",
          payload
        );

      return res.data;
    },

  publicConfig:
    async (chatbotId) => {
      const res =
        await api.get(
          `/api/chatbot/public/${chatbotId}`
        );

      return res.data;
    },

  chat:
    async (payload) => {
      const res =
        await api.post(
          "/api/chatbot/chat",
          payload
        );

      return res.data;
    },
};

export const uploadAPI = {
  trainingFile:
    async (formData) => {
      const headers =
        await getAuthHeaders(null);

      const res =
        await api.post(
          "/api/upload/training",
          formData,
          { headers }
        );

      return res.data;
    },
};

export const leadsAPI = {
  getLeads:
    async () => {
      const res =
        await api.get(
          "/api/leads"
        );

      return res.data;
    },

  getStats:
    async () => {
      const res =
        await api.get(
          "/api/leads/stats"
        );

      return res.data;
    },

  deleteLead:
    async (leadId) => {
      const res =
        await api.delete(
          `/api/leads/${leadId}`
        );

      return res.data;
    },

  exportCSV:
    async () => {
      try {
        const res =
          await api.get(
            "/api/leads/export/csv",
            {
              responseType: "blob",
            }
          );

        return res.data;
      } catch (err) {
        if (err.data instanceof Blob) {
          throw new Error(
            await parseBlobError(err.data)
          );
        }

        throw err;
      }
    },
};

export const appointmentsAPI = {
  getAppointments:
    async () => {
      const res =
        await api.get(
          "/api/appointments"
        );

      return res.data;
    },

  createAppointment:
    async (payload) => {
      const res =
        await api.post(
          "/api/appointments",
          payload
        );

      return res.data;
    },

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

  deleteAppointment:
    async (appointmentId) => {
      const res =
        await api.delete(
          `/api/appointments/${appointmentId}`
        );

      return res.data;
    },

  getStats:
    async () => {
      const res =
        await api.get(
          "/api/appointments/stats"
        );

      return res.data;
    },
};

export {
  API_URL,
  defaultIntegrations,
};

export default api;
