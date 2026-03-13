/* eslint-disable */
import axios from "axios";
import https from "https"; // 🔥 IMPORT THIS

// ⚙️ CONFIGURATION
const IPROG_API_URL = "https://www.iprogsms.com/api/v1/sms_messages";
const API_TOKEN = "91cd9b51843684f56d4a0741c1d6c822bd97b57d";

// 🔥 CREATE A CUSTOM AGENT TO PREVENT DISCONNECTS
const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false, // ⚠️ Bypasses SSL strictness (Fixes ECONNRESET often)
});

export const sendSMS = async (phoneNumber: string, message: string) => {
  try {
    // 1. FORMAT NUMBER
    let cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

    // Normalize +63 or 63 to 0
    if (cleanNumber.startsWith("63")) {
      cleanNumber = "0" + cleanNumber.substring(2);
    } else if (cleanNumber.startsWith("9")) {
      cleanNumber = "0" + cleanNumber;
    }

    // 2. CHECK LENGTH
    if (cleanNumber.length !== 11) {
      console.error(`❌ SMS ABORTED: Invalid Number Format (${cleanNumber})`);
      return false;
    }

    console.log(`🚀 Sending to iProg (${cleanNumber})...`);

    const payload = {
      api_token: API_TOKEN,
      phone_number: cleanNumber,
      message: message,
    };

    // 3. SEND REQUEST (ROBUST MODE)
    const response = await axios.post(IPROG_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", // Pretend to be a browser
        Connection: "keep-alive",
      },
      httpsAgent: agent, // Use the custom agent
      timeout: 10000, // Wait 10 seconds before giving up
    });

    const timeLog = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    });
    console.log(`[${timeLog}] 🚀 Sending to iProg (${cleanNumber})...`);

    // 4. VALIDATE RESPONSE
    // iProg uses status 200 for success
    if (response.data.status == 200) {
      console.log(`[${timeLog}] ✅ SMS ACCEPTED BY PROVIDER`);
      return true;
    } else {
      console.error(`[${timeLog}] ❌ PROVIDER ERROR:`, response.data.message);
      return false;
    }
  } catch (error: any) {
    // Detailed Error Logging
    if (error.code === "ECONNRESET") {
      console.error(
        "🔥 NETWORK ERROR: The connection was dropped. Check your internet.",
      );
    } else if (error.response) {
      console.error(
        "🔥 API ERROR:",
        error.response.status,
        error.response.data,
      );
    } else {
      console.error("🔥 UNKNOWN ERROR:", error.message);
    }
    return false;
  }
};
