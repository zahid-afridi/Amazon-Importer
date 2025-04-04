import express from "express";
import { GetPakages } from "../controllers/Pakages.js";

const PakagesRoutes=express.Router()

PakagesRoutes.get('/getpakages',GetPakages)

export default  PakagesRoutes



