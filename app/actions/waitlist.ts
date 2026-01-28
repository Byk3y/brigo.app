"use server";

import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export async function joinWaitlist(formData: FormData) {
    const rawEmail = formData.get('email');

    // Type check
    if (typeof rawEmail !== 'string') {
        return { error: 'Invalid request' };
    }

    // Sanitize and normalize
    const email = rawEmail.trim().toLowerCase();

    // Basic validation
    if (!email) {
        return { error: 'Email is required' };
    }

    // Length check (prevent abuse)
    if (email.length > 254) {
        return { error: 'Email is too long' };
    }

    // Format validation
    if (!EMAIL_REGEX.test(email)) {
        return { error: 'Please enter a valid email address' };
    }

    try {
        // 1. Save to Supabase
        const { error: dbError } = await supabase
            .from('waitlist')
            .insert([{ email, platform: 'android' }]);

        if (dbError) {
            if (dbError.code === '23505') { // Unique violation
                return { error: 'You are already on the waitlist!' };
            }
            throw dbError;
        }

        // 2. Send Welcome Email via Resend
        const { error: emailError } = await resend.emails.send({
            from: 'Brigo <hello@brigo.app>',
            to: [email],
            subject: 'You\'re on the Brigo Android Waitlist! 🚀',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
                    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Welcome to the inner circle!</h1>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        Thanks for joining the waitlist for Brigo on Android. We're working hard to bring the same premium study experience to the Play Store.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        As an early supporter, you'll be among the first to know when we launch, and we might even have a special surprise waiting for you on Day 1.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                        Stay tuned, <br />
                        The Brigo Team
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;" />
                    <p style="font-size: 12px; color: #666;">
                        © 2026 Brigo. All rights reserved.
                    </p>
                </div>
            `,
        });

        if (emailError) {
            console.error('Resend Error:', emailError);
            // We don't want to return an error to the user if the record was saved but email failed
        }

        return { success: true };
    } catch (error) {
        console.error('Waitlist error:', error);
        return { error: 'Something went wrong. Please try again later.' };
    }
}
