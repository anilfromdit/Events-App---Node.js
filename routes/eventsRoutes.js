const express = require("express");

const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventsController");
const router = express.Router();

router.route("/events/").get(getEvents).post(createEvent);
router.route("/events/:id").put(updateEvent).delete(deleteEvent);

module.exports = router;
