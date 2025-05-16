"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activeSchedulingController_1 = require("../controllers/activeSchedulingController");
const router = express_1.default.Router();
router.get('/', activeSchedulingController_1.getAllSchedules);
router.post('/create', activeSchedulingController_1.createSchedule);
router.get('/test-direct', activeSchedulingController_1.testDirectRead);
router.post('/:id', activeSchedulingController_1.updateSchedule);
exports.default = router;
