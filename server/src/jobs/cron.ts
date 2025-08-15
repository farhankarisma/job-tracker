import cron from 'node-cron';
import prisma from '../lib/prisma';
import { sendReminderEmail } from '../services/emailService';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const checkReminders = async () => {
  console.log('--- Running Daily Reminder Check ---');
  
  // --- PERBAIKAN: Bekerja sepenuhnya dalam UTC ---
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Atur ke awal hari INI dalam UTC
  
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1); // Atur ke awal hari BERIKUTNYA dalam UTC

  console.log(`[DEBUG] Searching for reminders between (gte): ${today.toISOString()} and (lt): ${tomorrow.toISOString()}`);
  // --- AKHIR PERBAIKAN ---

  try {
    const jobsToRemind = await prisma.job.findMany({
      where: {
        reminderAt: {
          gte: today,
          lt: tomorrow,
        },
        reminder_sent: false, // Only send reminders that haven't been sent
      },
    });

    if (jobsToRemind.length === 0) {
      console.log('No reminders found for this time range.');
      const allJobsWithReminders = await prisma.job.findMany({
        where: { reminderAt: { not: null } },
        select: { id: true, reminderAt: true, reminder_sent: true },
      });
      console.log('[DEBUG] All jobs with reminders in DB:', allJobsWithReminders);
      return;
    }

    console.log(`Found ${jobsToRemind.length} reminders to send.`);

    // Try to get user emails using admin API
    let userEmailMap = new Map<string, string>();
    
    try {
      const userIds = [...new Set(jobsToRemind.map(job => job.userId))];
      const { data: users, error: userError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

      if (userError) {
        console.error('Admin API error:', userError);
        throw userError;
      }

      const userEntries: [string, string][] = users.users
        .filter(u => u.email)
        .map(u => [u.id, u.email!] as [string, string]);
      userEmailMap = new Map(userEntries);
    } catch (adminError) {
      console.error('Failed to get users via admin API, trying alternative method:', adminError);
      
      // Alternative: Get user info from auth.users (if you have RLS disabled for service role)
      // Or use a different approach - store email in your database
      console.log('Please configure SUPABASE_SERVICE_ROLE_KEY in your .env file for reminder emails to work.');
      return;
    }

    for (const job of jobsToRemind) {
      const userEmail = userEmailMap.get(job.userId);
      if (userEmail) {
        try {
          const emailSent = await sendReminderEmail(userEmail, job);
          if (emailSent) {
            // Mark reminder as sent
            await prisma.job.update({
              where: { id: job.id },
              data: { reminder_sent: true }
            });
            console.log(`✅ Reminder sent and marked for job ${job.id}`);
          }
        } catch (emailError) {
          console.error(`❌ Failed to send email for job ${job.id}:`, emailError);
        }
      } else {
        console.error(`❌ No email found for user ${job.userId}`);
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

export const startReminderCronJob = () => {
  cron.schedule('0 8 * * *', () => {
    checkReminders();
  }, {
    timezone: "Asia/Jakarta"
  });

  console.log('📧 Reminder cron job scheduled to run every day at 8:00 AM (Asia/Jakarta).');
};
