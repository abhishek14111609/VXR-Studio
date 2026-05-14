const Lead = require('../models/Lead');
const { sendMail } = require('../utils/mailer');

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.replyToLead = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required.' });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    const plainText = [
      `Hi ${lead.name || 'there'},`,
      '',
      message,
      '',
      'Best regards,',
      'VXR Media House',
      'info@vxrmedia.in',
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${lead.name || 'there'},</p>
        <p style="white-space: pre-line;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p>Best regards,<br/>VXR Media House<br/>info@vxrmedia.in</p>
      </div>
    `;

    await sendMail({
      to: lead.email,
      subject,
      text: plainText,
      html,
      replyTo: 'info@vxrmedia.in',
    });

    lead.status = 'contacted';
    lead.lastReplySubject = subject;
    lead.lastReplyMessage = message;
    lead.lastRepliedAt = new Date();
    if (req.user?._id) {
      lead.repliedBy = req.user._id;
    }

    await lead.save();

    res.json({
      success: true,
      message: 'Reply sent successfully.',
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
