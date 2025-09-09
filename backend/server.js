const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const config = require('./config');

const app = express();
const PORT = config.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_APP_PASSWORD
  }
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { rating, feedback, email, company, selectedQuestions, additionalFeedback } = req.body;

    // Create email content
    const emailContent = `
AI Orchestrator Feedback Submission

Rating: ${rating}/5 stars
${'⭐'.repeat(rating)} ${rating === 1 && 'Poor' || rating === 2 && 'Fair' || rating === 3 && 'Good' || rating === 4 && 'Very Good' || rating === 5 && 'Excellent'}

Selected Questions:
${selectedQuestions && selectedQuestions.length > 0 ? selectedQuestions.map(q => `• ${q}`).join('\n') : 'No specific questions selected'}

Feedback:
${feedback || 'No feedback provided'}

Additional Feedback:
${additionalFeedback || 'No additional feedback'}

Contact Information:
Email: ${email}
Company: ${company || 'N/A'}
Date: ${new Date().toLocaleString()}

---
This feedback was submitted through the AI Orchestrator Demo.
    `;

    // Send email to you
    await transporter.sendMail({
      from: config.GMAIL_USER,
      to: 'aiorchestratoor@gmail.com',
      subject: `AI Orchestrator Feedback - ${email} (${company || 'No Company'})`,
      text: emailContent
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: config.GMAIL_USER,
      to: email,
      subject: 'Thank you for your feedback! - AI Orchestrator',
      text: `
Hi there!

Thank you for your feedback on AI Orchestrator! We really appreciate you taking the time to share your thoughts.

We'll review your feedback and get back to you soon. You're now on our early access list and will be the first to know when we launch!

Best regards,
The AI Orchestrator Team
      `
    });

    res.json({ success: true, message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('Error sending feedback:', error);
    res.status(500).json({ success: false, message: 'Error sending feedback' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Orchestrator Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Orchestrator Backend running on port ${PORT}`);
  console.log(`📧 Feedback emails will be sent to: aiorchestratoor@gmail.com`);
});
