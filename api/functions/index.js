/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const {initializeApp} = require("firebase-admin/app");
const axios = require("axios");
const {onRequest} = require("firebase-functions/v2/https");

initializeApp();

const db = admin.firestore();

const EVENT_API_URL = "https://delightful-forest-0475dad03.5.azurestaticapps.net/api/Events";

// Core logic for scheduling event notifications
const scheduleEventNotificationCore = async () => {
  logger.info("scheduleEventNotification function triggered");

  const today = new Date();
  const oneDayAway = new Date(today);
  const oneWeekAway = new Date(today);

  oneDayAway.setDate(today.getDate() + 1);
  oneWeekAway.setDate(today.getDate() + 7);

  try {
    // Fetch events from external API
    logger.info("Fetching events from API");
    const response = await axios.get(EVENT_API_URL);
    const events = response.data;
    logger.info("Events fetched:", events);

    // Filter events that are exactly one day or one week away
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        (eventDate.toDateString() === oneDayAway.toDateString()) ||
        (eventDate.toDateString() === oneWeekAway.toDateString())
      );
    });
    logger.info("Filtered events:", filteredEvents);

    // Format and add each notification to the Firestore collection
    const batch = db.batch();
    const notificationIds = [];

    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.date);
      const isOneDayAway = eventDate.toDateString()===oneDayAway.toDateString();
      const notificationBody =
          `Description: ${event.description}\n
          Location: ${event.location}\n
          Venue Type: ${event.venue_type}\n
          Capacity: ${event.capacity}\n
          Start Time: ${event.start_time}\n
          End Time: ${event.end_time}\n
          Price: ${event.price}`;
      const notificationData = {
        Audience: "Staff",
        Body: notificationBody,
        Date: new Date().toISOString(),
        Sender: "Event Notification",
        SenderID: "system",
        Title: isOneDayAway ?
        `Reminder: The event "${event.name}" is happening tomorrow!` :
        `Upcoming Event: ${event.name}`,
      };
      const notificationRef = db.collection("Notifications").doc();
      batch.set(notificationRef, notificationData);
      notificationIds.push(notificationRef.id);
    });

    await batch.commit();
    logger.info("Notifications added for events one day and one week away.");

    // Fetch all staff members
    const usersSnapshot = await db.collection("Users")
        .where("role", "==", "staff").get();

    // Add the notification to each staff member's userNotification array
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      const userNotifications = userData.userNotifications || [];

      notificationIds.forEach((notificationId) => {
        userNotifications.push({id: notificationId, isRead: false});
      });

      await db.collection("Users").doc(userDoc.id).update({
        userNotifications: userNotifications,
      });
    });

    logger.info("Notifications added to userNotification arrays.");
  } catch (error) {
    logger.error("Error fetching events or saving notifications:", error);
  }
};

// Scheduled function
exports.scheduleEventNotification = onSchedule({
  schedule: "0 7 * * *",
  timeZone: "Africa/Johannesburg",
}, async (context) => {
  await scheduleEventNotificationCore();
});

// HTTP function to manually trigger the scheduled function
exports.triggerScheduleEventNotification = onRequest(async (req, res) => {
  try {
    await scheduleEventNotificationCore();
    res.status(200).send("Scheduled function triggered successfully.");
  } catch (error) {
    logger.error("Error triggering scheduled function:", error);
    res.status(500).send("Error triggering scheduled function.");
  }
});
