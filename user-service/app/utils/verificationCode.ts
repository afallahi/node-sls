import twilio from "twilio";

const accountSid = "";  //TODO: take from Twilio account
const authToken = "";   //TODO: take from Twilio account
const FROM_PHONE_NUMBER = "";   //TODO" take from Twilio account
const client = twilio(accountSid, authToken);

export const GenerateVerificationCode = () => {
    const EXPIRY_MINUTES = 1;
    const code = Math.floor(10000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + EXPIRY_MINUTES * 60 * 1000);
    return {code, expiry};
}

export const SendVerificationCode = async (code: number, toPhone: string) => {
    const response = await client.messages.create({
        body: `Your verification code is ${code}`,
        from: FROM_PHONE_NUMBER,
        to: toPhone.trim()
    });
    console.log(response);
    return response;
}