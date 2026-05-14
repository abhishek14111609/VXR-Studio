const nodemailer = require('nodemailer');

const transporters = new Map();

const parsePort = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getSmtpConfig = () => {
    const host = process.env.SMTP_HOST;
    const primaryPort = parsePort(process.env.SMTP_PORT, 465);
    const fallbackPort = parsePort(process.env.SMTP_FALLBACK_PORT, primaryPort === 465 ? 587 : 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error('SMTP is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
    }

    const ports = Array.from(new Set([primaryPort, fallbackPort]));

    return {
        host,
        user,
        pass,
        ports,
    };
};

const getTransporterByPort = (port) => {
    const cacheKey = String(port);
    if (transporters.has(cacheKey)) {
        return transporters.get(cacheKey);
    }

    const { host, user, pass } = getSmtpConfig();
    const secure = port === 465;

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        requireTLS: !secure,
        auth: {
            user,
            pass,
        },
        connectionTimeout: parsePort(process.env.SMTP_CONNECTION_TIMEOUT, 15000),
        greetingTimeout: parsePort(process.env.SMTP_GREETING_TIMEOUT, 12000),
        socketTimeout: parsePort(process.env.SMTP_SOCKET_TIMEOUT, 20000),
        tls: {
            servername: host,
            minVersion: 'TLSv1.2',
            rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
        },
    });

    transporters.set(cacheKey, transporter);
    return transporter;
};

const sendWithFailover = async (mailOptions) => {
    const { ports } = getSmtpConfig();
    const errors = [];

    for (const port of ports) {
        try {
            const client = getTransporterByPort(port);
            return await client.sendMail(mailOptions);
        } catch (error) {
            errors.push(`port ${port}: ${error.message}`);
        }
    }

    throw new Error(`SMTP send failed on all configured ports (${errors.join(' | ')})`);
};

const sendMail = async ({ to, subject, text, html, replyTo }) => {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    if (!from) {
        throw new Error('SMTP_FROM or SMTP_USER must be set.');
    }

    return sendWithFailover({
        from,
        to,
        subject,
        text,
        html,
        replyTo,
    });
};

module.exports = {
    sendMail,
};
