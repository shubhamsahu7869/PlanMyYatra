"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getMe = getMe;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
function createToken(userId) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: "7d" });
}
function safeUser(user) {
    return { id: user.id, name: user.name, email: user.email };
}
async function registerUser(req, res) {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({ name, email, passwordHash });
        const token = createToken(user.id);
        res.status(201).json({ success: true, user: safeUser({ id: user.id, name: user.name, email: user.email }), token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid input", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to create user" });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = createToken(user.id);
        res.json({ success: true, user: safeUser({ id: user.id, name: user.name, email: user.email }), token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: "Invalid input", issues: error.errors });
        }
        res.status(500).json({ success: false, message: "Unable to login" });
    }
}
async function getMe(req, res) {
    try {
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const user = await User_1.default.findById(req.userId).select("name email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Unable to retrieve user" });
    }
}
