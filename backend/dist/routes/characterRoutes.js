"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const characterController_1 = require("../controllers/characterController");
console.log('✅ characterRoutes loaded');
const router = express_1.default.Router();
router.get('/', characterController_1.getFullCharacters); // GET /api/characters
router.get('/core', characterController_1.getCoreCharacters); // GET /api/characters/core
router.get('/summary', characterController_1.getCharacterSummary);
router.put('/:id', characterController_1.updateCharacter);
exports.default = router;
