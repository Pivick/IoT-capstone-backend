/* eslint-disable */
import mongoose from "mongoose";
import cron from "node-cron";
import Booking from "../model/booking.model";
import { sendSMS } from "../services/sms.service";

const startOverstayMonitor = () => {
  console.log("⏰ Overstay Monitor Started...");

  // Run every 1 minute
  cron.schedule("* * * * *", async () => {
    if (mongoose.connection.readyState !== 1) return;

    try {
      const now = new Date();
      // Logic: 30 minutes ago
      const timeLimit = new Date(now.getTime() - 30 * 60 * 1000);

      // 1. Initial Find
      // Find visitors who finished transaction >30 mins ago AND haven't been warned
      const overstayers = await Booking.find({
        transactionTime: { $ne: null, $lt: timeLimit },
        timeOut: null,
        smsSent: { $ne: true }, // Covers 'false' and 'undefined'
      });

      if (overstayers.length === 0) return;

      console.log(`⚠️ Found ${overstayers.length} potential overstayers.`);

      for (const visitor of overstayers) {
        // 🔥 SAFETY CHECK: Fetch user again to prevent duplicates/race conditions
        const freshRecord = await Booking.findById(visitor._id);

        // Skip if already exited or warned in the last millisecond
        if (
          !freshRecord ||
          freshRecord.timeOut ||
          freshRecord.smsSent === true
        ) {
          console.log(`   ⏩ Skipping ${visitor.firstName} (Already handled)`);
          continue;
        }

        // 🔥 LOGIC FIX: Check for Invalid/Dummy Numbers
        // If number is missing or dummy, mark as 'sent' to stop the loop
        if (
          !visitor.phoneNumber ||
          visitor.phoneNumber === "0000000000" ||
          visitor.phoneNumber.length < 10
        ) {
          console.log(`   ⏩ Skipping ${visitor.firstName} (Invalid Phone)`);
          await Booking.updateOne(
            { _id: visitor._id },
            { $set: { smsSent: true } },
          );
          continue;
        }

        const message = `UNI-VENTRY ALERT: Hello ${visitor.firstName}, 30 minutes have passed since your office transaction. Please proceed to the exit immediately for logout process.`;

        // 2. Send SMS
        // We keep 'await' here because we MUST know if it succeeded before updating DB
        const success = await sendSMS(visitor.phoneNumber, message);

        // 3. Update DB
        if (success) {
          // Use updateOne for atomic update
          await Booking.updateOne(
            { _id: visitor._id },
            { $set: { smsSent: true } },
          );
          console.log(`   ✅ Warned: ${visitor.firstName}`);
        } else {
          console.log(
            `   ❌ SMS Failed for ${visitor.firstName}. Will retry next cycle.`,
          );
        }
      }
    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });
};

export default startOverstayMonitor;
