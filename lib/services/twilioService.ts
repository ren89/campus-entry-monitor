import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const whatsappNumber = process.env.TWILIO_WHATSAPP_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber || !whatsappNumber) {
  throw new Error("Twilio environment variables are not set");
}

console.log("Twilio service initialized with account SID:", accountSid);
console.log("Twilio phone number:", fromNumber);
console.log("Twilio auth token:", authToken);

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, body: string) {
  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    return message;
  } catch (error) {
    throw error;
  }
}

export async function sendWhatsApp(to: string, body: string) {
  try {
    const message = await client.messages.create({
      body,
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${to}`,
    });
    return message;
  } catch (error) {
    throw error;
  }
}
