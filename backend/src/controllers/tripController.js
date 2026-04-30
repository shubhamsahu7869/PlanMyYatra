"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrips = getTrips;
exports.createTrip = createTrip;
exports.getTripById = getTripById;
exports.updateTrip = updateTrip;
exports.deleteTrip = deleteTrip;
exports.regenerateDay = regenerateDay;
exports.optimizeMood = optimizeMood;
exports.addActivity = addActivity;
exports.updateActivity = updateActivity;
exports.deleteActivity = deleteActivity;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const Trip_1 = __importDefault(require("../models/Trip"));
const aiService_1 = require("../services/aiService");
const createTripSchema = zod_1.z.object({
    destination: zod_1.z.string().min(2),
    numberOfDays: zod_1.z.number().int().min(1).max(14),
    budgetType: zod_1.z.enum(["Low", "Medium", "High"]),
    interests: zod_1.z.array(zod_1.z.string()).min(1),
});
const updateTripSchema = zod_1.z.object({
    destination: zod_1.z.string().min(2).optional(),
    numberOfDays: zod_1.z.number().int().min(1).max(14).optional(),
    budgetType: zod_1.z.enum(["Low", "Medium", "High"]).optional(),
    interests: zod_1.z.array(zod_1.z.string()).optional(),
});
function invalidObjectId(res) {
    return res.status(400).json({ success: false, message: "Invalid trip ID" });
}
async function findTrip(req, res) {
    if (!mongoose_1.default.isValidObjectId(req.params.id)) {
        return null;
    }
    const trip = await Trip_1.default.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) {
        res.status(404).json({ success: false, message: "Trip not found" });
        return null;
    }
    return trip;
}
async function getTrips(req, res) {
    try {
        const trips = await Trip_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, trips });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Unable to fetch trips" });
    }
}
async function createTrip(req, res) {
    try {
        const userId = req.userId;
        const { destination, numberOfDays, budgetType, interests } = createTripSchema.parse(req.body);
        const [itinerary, budgetEstimate, hotelSuggestions] = await Promise.all([
            (0, aiService_1.generateItinerary)({ destination, numberOfDays, interests }),
            (0, aiService_1.generateBudgetEstimate)({ destination, numberOfDays, budgetType }),
            (0, aiService_1.generateHotelSuggestions)({ destination, budgetType }),
        ]);
        const trip = await Trip_1.default.create({
            userId,
            destination,
            numberOfDays,
            budgetType,
            interests,
            itinerary,
            budgetEstimate,
            hotelSuggestions,
        });
        res.status(201).json({ success: true, trip });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid input", issues: error.errors });
        }
        console.error("Create trip failed", error);
        res.status(500).json({ success: false, message: "Unable to create trip" });
    }
}
async function getTripById(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        res.json({ success: true, trip });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Unable to fetch trip" });
    }
}
async function updateTrip(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const updates = updateTripSchema.parse(req.body);
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        Object.assign(trip, updates);
        await trip.save();
        res.json({ success: true, trip });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid update data", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to update trip" });
    }
}
async function deleteTrip(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        await trip.deleteOne();
        res.json({ success: true, message: "Trip deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Unable to delete trip" });
    }
}
async function regenerateDay(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const { dayNumber, prompt } = zod_1.z.object({
            dayNumber: zod_1.z.number().int().min(1),
            prompt: zod_1.z.string().min(10),
        }).parse(req.body);
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        trip.itinerary = await (0, aiService_1.regenerateDay)({
            itinerary: trip.itinerary,
            dayNumber,
            prompt,
            destination: trip.destination,
            interests: trip.interests,
        });
        await trip.save();
        res.json({ success: true, trip });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid input", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to regenerate day" });
    }
}
async function optimizeMood(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const { mood } = zod_1.z.object({
            mood: zod_1.z.enum(["Relaxed", "Packed", "Romantic", "Family Friendly", "Adventure Heavy", "Cultural"]),
        }).parse(req.body);
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        trip.mood = mood;
        trip.itinerary = await (0, aiService_1.optimizeTripMood)({
            itinerary: trip.itinerary,
            mood,
            destination: trip.destination,
            numberOfDays: trip.numberOfDays,
            budgetType: trip.budgetType,
            interests: trip.interests,
        });
        await trip.save();
        res.json({ success: true, trip });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid mood selection", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to optimize mood" });
    }
}
async function addActivity(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const { dayNumber, section, activity } = zod_1.z.object({
            dayNumber: zod_1.z.number().int().min(1),
            section: zod_1.z.enum(["morning", "afternoon", "evening", "foodSuggestion", "travelTip"]),
            activity: zod_1.z.string().min(3),
        }).parse(req.body);
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        trip.itinerary = await (0, aiService_1.addTripActivity)(trip.itinerary, dayNumber, section, activity);
        await trip.save();
        res.json({ success: true, trip });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid input", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to add activity" });
    }
}
async function updateActivity(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const { dayNumber, section, activity } = zod_1.z.object({
            dayNumber: zod_1.z.number().int().min(1),
            section: zod_1.z.enum(["morning", "afternoon", "evening", "foodSuggestion", "travelTip"]),
            activity: zod_1.z.string().min(3),
        }).parse(req.body);
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        trip.itinerary = await (0, aiService_1.updateTripActivity)(trip.itinerary, dayNumber, section, activity);
        await trip.save();
        res.json({ success: true, trip });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid input", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to update activity" });
    }
}
async function deleteActivity(req, res) {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            return invalidObjectId(res);
        }
        const { dayNumber, section } = zod_1.z.object({
            dayNumber: zod_1.z.number().int().min(1),
            section: zod_1.z.enum(["morning", "afternoon", "evening", "foodSuggestion", "travelTip"]),
        }).parse(req.body);
        const trip = await findTrip(req, res);
        if (!trip)
            return;
        trip.itinerary = await (0, aiService_1.deleteTripActivityById)(trip.itinerary, dayNumber, section);
        await trip.save();
        res.json({ success: true, trip });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid input", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to delete activity" });
    }
}
