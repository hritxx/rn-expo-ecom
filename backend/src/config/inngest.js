import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ecom-app" });
const syncUser = inngest.createFunction(
  {
    id: "sync-user",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      if (!email_addresses || email_addresses.length === 0) {
        throw new Error("User has no email addresses");
      }

      const fullName = `${first_name || ""} ${last_name || ""}`.trim();
      const newUser = {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: fullName || "User",
        imageUrl: image_url,
        addresses: [],
        wishlist: [],
      };
      await User.create(newUser);
      console.log(`User synced successfully: ${id}`);
    } catch (error) {
      console.error("Failed to sync user:", error);
      throw error;
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id } = event.data;
      if (!id) {
        throw new Error("User ID is required for deletion");
      }
      const result = await User.deleteOne({ clerkId: id });
      console.log(
        `User deletion result for ${id}:`,
        result.deletedCount > 0 ? "success" : "not found"
      );
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  }
);

// export array of inngest functions
export const functions = [syncUser, deleteUserFromDB];
