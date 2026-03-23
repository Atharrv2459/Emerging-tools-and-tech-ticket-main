import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


const getAgentTypeLabel = (agent_type) => {
  if (!agent_type) return null;

  switch (agent_type) {
    case 'normal':
      return 'Consultant';
    case 'delivery_lead':
      return 'Delivery Lead';
    case 'hod':
      return 'HOD';
    case 'admin':
      return 'Admin';
    default:
      return agent_type;
  }
};

export const sendUserCredentialsEmail = async ({
  to,
  name,
  email,
  role,
  agent_type,
  customer_type,
  account_name,
  tempPassword,
  manager_email,
  delivery_lead_email
}) => {

 
  const html = `
    <h3>Welcome to Ticket Management System</h3>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Role:</strong> ${role}</p>

    ${agent_type ? `<p><strong>Agent Type:</strong> ${getAgentTypeLabel(agent_type)}</p>` : ''}
    ${customer_type ? `<p><strong>Customer Type:</strong> ${customer_type}</p>` : ''}

    ${manager_email ? `<p><strong>Customer Manager:</strong> ${manager_email}</p>` : ''}
    ${delivery_lead_email ? `<p><strong>Delivery Lead:</strong> ${delivery_lead_email}</p>` : ''}

    <p><strong>Account Name:</strong> ${account_name}</p>

    <hr/>
    <p><strong>Temporary Password:</strong> ${tempPassword}</p>

    <p>Please login and change your password immediately.</p>
  `;

  const response = await transporter.sendMail({
    from: `"Support Team" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your Account Credentials',
    html
  });

  console.log('Email sent response:', response);
};