"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const currentScheduleController_1 = require("../controllers/currentScheduleController");
const currentScheduleController_2 = require("../controllers/currentScheduleController");
const currentScheduleController_3 = require("../controllers/currentScheduleController");
const router = express_1.default.Router();
router.get('/', currentScheduleController_1.getCurrentSchedule); // GET /api/current-schedule
router.post('/', currentScheduleController_2.setCurrentSchedule);
router.post('/update', currentScheduleController_3.updateCurrentSchedule);
exports.default = router;
