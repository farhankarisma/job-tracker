import cron from 'node-cron';
import prisma from '../lib/prisma';
import { sendReminderEmail } from '../services/emailService';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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
      },
    });

    if (jobsToRemind.length === 0) {
      console.log('No reminders found for this time range.');
      const allJobsWithReminders = await prisma.job.findMany({
        where: { reminderAt: { not: null } },
        select: { id: true, reminderAt: true },
      });
      console.log('[DEBUG] All jobs with reminders in DB:', allJobsWithReminders);
      return;
    }

    console.log(`Found ${jobsToRemind.length} reminders to send.`);

    const userIds = [...new Set(jobsToRemind.map(job => job.userId))];
    const { data: users, error: userError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (userError) throw userError;

    const userEmailMap = new Map(users.users.map(u => [u.id, u.email]));

    for (const job of jobsToRemind) {
      const userEmail = userEmailMap.get(job.userId);
      if (userEmail) {
        await sendReminderEmail(userEmail, job);
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
