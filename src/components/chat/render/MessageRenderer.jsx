import AppointmentCard from "../cards/AppointmentCard";
import ContactCard from "../cards/ContactCard";
import FileCard from "../cards/FileCard";
import ImageCard from "../cards/ImageCard";
import LocationCard from "../cards/LocationCard";

/*
========================================
MESSAGE RENDERER
========================================
*/

export default function MessageRenderer({
  message,
  integrations = {},
}) {
  if (!message) return null;

  /*
  ========================================
  TEXT MESSAGE
  ========================================
  */

  if (!message.type || message.type === "text") {
    return message.text || "";
  }

  /*
  ========================================
  APPOINTMENT
  ========================================
  */

  if (message.type === "appointment") {
    return (
      <AppointmentCard
        title={message.title}
        description={message.description}
        buttonText={message.buttonText}
        meetingLink={
          message.meetingLink ||
          integrations.meeting_link
        }
      />
    );
  }

  /*
  ========================================
  LOCATION
  ========================================
  */

  if (message.type === "location") {
    return (
      <LocationCard
        title={message.title}
        address={message.address}
        buttonText={message.buttonText}
        mapsLink={
          message.mapsLink ||
          integrations.maps_link
        }
      />
    );
  }

  /*
  ========================================
  CONTACT
  ========================================
  */

  if (message.type === "contact") {
    return (
      <ContactCard
        phone={message.phone}
        email={message.email}
        website={message.website}
        whatsapp={message.whatsapp}
      />
    );
  }

  /*
  ========================================
  IMAGE
  ========================================
  */

  if (message.type === "image") {
    return (
      <ImageCard
        image={message.image}
        title={message.title}
        description={message.description}
        link={message.link}
      />
    );
  }

  /*
  ========================================
  FILE
  ========================================
  */

  if (message.type === "file") {
    return (
      <FileCard
        fileName={message.fileName}
        fileType={message.fileType}
        fileSize={message.fileSize}
        downloadUrl={message.downloadUrl}
      />
    );
  }

  /*
  ========================================
  FALLBACK
  ========================================
  */

  return message.text || "";
}