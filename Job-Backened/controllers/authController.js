const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Company = require("./models/Company");

// Company registration
exports.register = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    let company = await Company.findOne({ email });
    if (company) return res.status(400).json({ msg: "Company already exists" });

    company = new Company({ name, email, password, mobile });
    const salt = await bcrypt.genSalt(10);
    company.password = await bcrypt.hash(password, salt);

    await company.save();

    // Generate verification token
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send verification email
    await sendVerificationEmail(company.email, token);

    res.json({ msg: "Company registered. Please verify your email." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Email verification function
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const message = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Email Verification",
    html: `<h3>Please verify your email by clicking the link below:</h3>
               <a href="${process.env.CLIENT_URL}/verify-email/${token}">Verify Email</a>`,
  };

  await transporter.sendMail(message);
};

// Login controller function
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (!company) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!company.isVerified)
      return res.status(403).json({ msg: "Please verify your email" });

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
