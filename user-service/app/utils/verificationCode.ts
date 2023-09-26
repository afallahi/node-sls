import twilio from "twilio";
require('dotenv').config();

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export const GenerateVerificationCode = () => {
    const EXPIRY_MINUTES = 5;
    const code = Math.floor(10000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + EXPIRY_MINUTES * 60 * 1000);
    return {code, expiry};
}

export const SendVerificationCode = async (code: number, toPhone: string) => {
    const service = await client.verify.v2.services.create({friendlyName: 'User Verification Service'});
    const verification = await client.verify.v2.services(process.env.VERIFY_SID).verifications.create({to: toPhone.trim(), channel: 'sms'})
    return verification.status;

}