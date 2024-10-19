import Job from '../models/Job.js';
import { sendEmail } from '../utils/sendEmail.js';

export const postJob = async (req, res) => {
  try {
    const { title, description, experienceLevel, endDate, candidates } = req.body;
    const job = new Job({ title, description, experienceLevel, endDate, candidates, company: req.company.id });
    await job.save();

    // Send job emails to all candidates
    const emailPromises = candidates.map((email) =>
      sendEmail(
        email,
        `Job Opportunity: ${title}`,
        `We have an open position for "${title}".\n\nDescription: ${description}\nExperience Level: ${experienceLevel}\nEnd Date: ${new Date(endDate).toDateString()}`
      )
    );
    await Promise.all(emailPromises);

    res.status(201).json({ message: 'Job posted and emails sent to candidates.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
