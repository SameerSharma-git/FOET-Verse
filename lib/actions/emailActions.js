'use server';

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAction({ to, subject, htmlContent }) {
    if (!to || !subject || !htmlContent) {
        return { 
            success: false, 
            message: 'Missing email parameters: recipient, subject, or content is required.' 
        };
    }

    try {
        const { data, error } = await resend.emails.send({
            // Ensure you use a verified domain email in a production environment
            from: 'SamNotesApp <onboarding@resend.dev>', 
            to: to, // Use the 'to' parameter from the payload
            subject: subject,
            html: htmlContent, 
        });

        if (error) {
            console.error('Resend API Error:', error);
            return { 
                success: false, 
                message: error.message || 'Failed to send email due to an API error.' 
            };
        }

        console.log('Email sent successfully:', data);
        return { 
            success: true, 
            message: 'Email sent successfully!', 
            data: data // Optional: return data if needed
        };

    } catch (error) {
        console.error('Server error during email send:', error);
        return { 
            success: false, 
            message: 'Internal server error. Please try again.' 
        };
    }
}