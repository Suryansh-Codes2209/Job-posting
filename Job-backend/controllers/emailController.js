import { sendEmail } from '../utils/sendEmail.js';
import Job from '../models/Job.js';

export const sendJobEmails = async (req, res) => {
  try {
    const { jobId, candidateEmails } = req.body;

    const job = await Job.findById(jobId).populate('company', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    const emailPromises = candidateEmails.map((email) =>
      sendEmail(
        email,
        `Job Opportunity: ${job.title}`,
        `Hi there!\n\n${job.company.name} has a new job posting.\n\nTitle: ${job.title}\nDescription: ${job.description}\n\nApply before: ${job.endDate.toDateString()}\n\nFor any questions, contact: ${job.company.email}`
      )
    );

    await Promise.all(emailPromises);

    res.status(200).json({ message: 'Emails sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
