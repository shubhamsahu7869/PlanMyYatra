"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itineraryDaySchema = new mongoose_1.Schema({
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    morning: { type: String, required: true },
    afternoon: { type: String, required: true },
    evening: { type: String, required: true },
    foodSuggestion: { type: String, required: true },
    travelTip: { type: String, required: true },
}, { _id: false });
const hotelSuggestionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, required: true },
    reason: { type: String, required: true },
}, { _id: false });
const tripSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    destination: { type: String, required: true, trim: true },
    numberOfDays: { type: Number, required: true, min: 1 },
    budgetType: { type: String, required: true, enum: ["Low", "Medium", "High"] },
    interests: [{ type: String, required: true }],
    itinerary: { type: [itineraryDaySchema], default: [] },
    budgetEstimate: {
        currency: { type: String, default: "USD" },
        flights: { type: Number, default: 0 },
        accommodation: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        activities: { type: Number, default: 0 },
        miscellaneous: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    hotelSuggestions: { type: [hotelSuggestionSchema], default: [] },
    mood: { type: String, enum: ["Relaxed", "Packed", "Romantic", "Family Friendly", "Adventure Heavy", "Cultural"] },
}, { timestamps: true });
const Trip = (0, mongoose_1.model)("Trip", tripSchema);
exports.default = Trip;
