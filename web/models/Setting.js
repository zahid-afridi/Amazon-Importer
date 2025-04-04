import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    keyName: { type: String },
    keyValue: { type: String },
    isDefault: { type: Number, default: 1 },
  },
  { versionKey: false, timestamps: true }
);
const SettingModel= mongoose.model("setting", settingSchema)

export default SettingModel
