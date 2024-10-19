import Company from '../models/Company.js';
import { createOTP, verifyOTP } from '../utils/otp.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendSMS } from '../utils/sendSms.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { name, phone, companyName, email, employeeSize } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) return res.status(400).json({ message: 'Company already registered.' });

    const company = new Company({ name, phone, companyName, email, employeeSize });
    await company.save();

    // Send OTPs for verification
    const emailOTP = createOTP(email);
    const phoneOTP = createOTP(phone);

    await sendEmail(email, 'Email OTP', `Your OTP is ${emailOTP}`);
    await sendSMS(phone, `Your OTP is ${phoneOTP}`);

    res.status(200).json({ message: 'OTP sent to email and phone. Please verify.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, phone, otp } = req.body;
  if (!verifyOTP(email, otp) || !verifyOTP(phone, otp))
    return res.status(400).json({ message: 'Invalid or expired OTP.' });

  await Company.findOneAndUpdate({ email }, { isVerified: true });
  res.status(200).json({ message: 'Account verified successfully.' });
};

export const login = async (req, res) => {
  const { email, phone } = req.body;
  const company = await Company.findOne({ email, phone, isVerified: true });

  if (!company) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ token });
};
