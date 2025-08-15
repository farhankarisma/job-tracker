import nodemailer from "nodemailer";
import { Job } from "@prisma/client";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReminderEmail = async (userEmail: string, job: Job): Promise<boolean> => {
  const mailOptions = {
    from: `"Gawekeun Job Tracker" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Reminder: Follow up on your job application for ${job.company}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔔 Job Application Reminder</h1>
          </div>
          
          <p style="font-size: 16px; color: #333;">Hi there!</p>
          
          <p style="font-size: 16px; color: #333;">
            This is a friendly reminder about your job application that might need a follow-up:
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">
              📍 ${job.position}
            </h3>
            <p style="margin: 5px 0; color: #666; font-size: 16px;">
              <strong>Company:</strong> ${job.company}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 16px;">
              <strong>Current Status:</strong> 
              <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                ${job.status}
              </span>
            </p>
            ${job.jobUrl ? `
              <p style="margin: 15px 0 5px 0;">
                <a href="${job.jobUrl}" style="color: #667eea; text-decoration: none; font-weight: bold;">
                  🔗 View Job Posting
                </a>
              </p>
            ` : ''}
            ${job.notes ? `
              <p style="margin: 15px 0 5px 0; color: #666;">
                <strong>Notes:</strong> ${job.notes}
              </p>
            ` : ''}
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 25px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Suggested Actions:</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Send a follow-up email to the hiring manager</li>
              <li>Check the company's career page for updates</li>
              <li>Connect with employees on LinkedIn</li>
              <li>Update your application status in Gawekeun</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
              📊 Open Gawekeun Dashboard
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best of luck with your job search! 🚀<br>
              - The Gawekeun Team
            </p>
          </div>
        </div>
        `,
  };

  try {
    // 3. Send the email using the transporter
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${userEmail} for job ${job.id}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${userEmail}:`, error);
    return false;
  }
};
