/*
========================================
VISITOR ID HOOK
========================================
*/

import { useState } from "react";

import {
  VISITOR_STORAGE_KEY,
} from "../constants/chatConstants";

/*
========================================
GENERATE VISITOR ID
========================================
*/
const generateVisitorId = () => {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 12)
  );
};

/*
========================================
GET OR CREATE VISITOR ID
========================================
*/
const getVisitorId = () => {
  try {
    let visitorId =
      localStorage.getItem(
        VISITOR_STORAGE_KEY
      );

    if (!visitorId) {
      visitorId =
        generateVisitorId();

      localStorage.setItem(
        VISITOR_STORAGE_KEY,
        visitorId
      );
    }

    return visitorId;
  } catch (error) {
    console.error(
      "VISITOR ID ERROR:",
      error
    );

    return generateVisitorId();
  }
};

/*
========================================
HOOK
========================================
*/
export default function useVisitorId() {
  const [visitorId] =
    useState(getVisitorId);

  return visitorId;
}