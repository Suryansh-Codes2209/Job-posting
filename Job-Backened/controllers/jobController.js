exports.postJob = async (req, res) => {
  const { title, description, experienceLevel, endDate, candidates } = req.body;
  try {
    const job = new Job({
      title,
      description,
      experienceLevel,
      endDate,
      company: req.company.id,
      candidates,
    });

    await job.save();

    // Send emails to candidates (optional)
    sendJobEmails(candidates, job);

    res.json({ msg: "Job posted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const sendJobEmails = async (candidates, job) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  candidates.forEach(async (candidate) => {
    const message = {
      from: process.env.SMTP_USER,
      to: candidate.email,
      subject: `New Job: ${job.title}`,
      html: `<h3>${job.title}</h3><p>${job.description}</p>`,
    };
    await transporter.sendMail(message);
  });
};
