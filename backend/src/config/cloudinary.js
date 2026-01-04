import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

const missingVars = [];
if (!ENV.CLOUDINARY_CLOUD_NAME) missingVars.push("CLOUDINARY_CLOUD_NAME");
if (!ENV.CLOUDINARY_API_KEY) missingVars.push("CLOUDINARY_API_KEY");
if (!ENV.CLOUDINARY_API_SECRET) missingVars.push("CLOUDINARY_API_SECRET");

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Cloudinary environment variables: ${missingVars.join(
      ", "
    )}`
  );
}

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;
