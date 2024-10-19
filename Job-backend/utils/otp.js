import crypto from 'crypto';

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export const otpStore = new Map(); // In-memory store (use Redis or DB for production)

export const createOTP = (emailOrPhone) => {
  const otp = generateOTP();
  const expiry = Date.now() + process.env.OTP_EXPIRY * 60 * 1000; // OTP expiry
  otpStore.set(emailOrPhone, { otp, expiry });
  return otp;
};

export const verifyOTP = (emailOrPhone, otp) => {
  const data = otpStore.get(emailOrPhone);
  if (!data) return false;
  const isValid = data.otp === otp && Date.now() < data.expiry;
  if (isValid) otpStore.delete(emailOrPhone); // Remove OTP after verification
  return isValid;
};
