const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('SMTP credentials missing in environment variables');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendOrderConfirmationEmail = async (order) => {
  const transporter = createTransporter();
  const senderEmail = process.env.SMTP_USER;
  const senderName = process.env.SMTP_FROM_NAME || 'Brewly coffee';

  const recipientEmail = order.customerEmail;
  const recipientName = order.customerName || (recipientEmail ? recipientEmail.split('@')[0] : 'Valued Customer');

  if (!recipientEmail) {
    console.log(`⚠️ Order #${order.id || ''} has no customer email address. Confirmation email skipped.`);
    return;
  }

  const itemsListHtml = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #e5e0d8;">
      <td style="padding: 10px; color: #1C1310; font-family: serif; font-weight: bold;">
        ${item.productName || item.name || 'Specialty Coffee'}
        <br>
        <span style="font-size: 11px; font-weight: normal; color: #5a504b;">${item.weight || '250g'} • ${item.grind || 'Whole Bean'}</span>
      </td>
      <td style="padding: 10px; text-align: center; color: #1C1310;">${item.quantity || 1}</td>
      <td style="padding: 10px; text-align: right; color: #2D3E35; font-weight: bold;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Brewly Coffee</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F7F4EE; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1C1310;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F4EE; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #E6E1D7;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #1C1310; padding: 30px 40px; text-align: center;">
                  <h1 style="color: #F7F4EE; margin: 0; font-family: Georgia, serif; font-size: 28px; letter-spacing: 1px;">
                    Brewly & Co.
                  </h1>
                  <p style="color: #D99B26; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                    COFFEE FOR CALM MORNINGS
                  </p>
                </td>
              </tr>

              <!-- Greeting & Order ID -->
              <tr>
                <td style="padding: 30px 40px 15px 40px;">
                  <h2 style="margin: 0 0 10px 0; color: #1C1310; font-family: Georgia, serif; font-size: 22px;">
                    Thank You For Your Order, ${recipientName}! ☕
                  </h2>
                  <p style="margin: 0; color: #5a504b; font-size: 14px; line-height: 1.6;">
                    We've received your coffee order <strong style="color: #2D3E35;">#${order.id || 'BRW-9482'}</strong>. Our artisan roasters are preparing your single-origin beans in small batches for peak freshness.
                  </p>
                </td>
              </tr>

              <!-- Order Summary Table -->
              <tr>
                <td style="padding: 10px 40px 20px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9F7F3; border-radius: 12px; padding: 15px; border: 1px solid #ECE7DE;">
                    <thead>
                      <tr style="border-bottom: 2px solid #D99B26; text-align: left; font-size: 12px; text-transform: uppercase; color: #2D3E35;">
                        <th style="padding: 8px 10px;">Item</th>
                        <th style="padding: 8px 10px; text-align: center;">Qty</th>
                        <th style="padding: 8px 10px; text-align: right;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsListHtml}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Price Totals & Payment Details -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" valign="top" style="padding-right: 15px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #2D3E35;">Delivery & Payment</h4>
                        <p style="margin: 0; font-size: 12px; color: #5a504b; line-height: 1.5;">
                          <strong>Payment Method:</strong> ${order.paymentMethod || 'Online Card Payment'}<br>
                          <strong>Phone:</strong> ${order.customerPhone || 'Provided at checkout'}<br>
                          <strong>Status:</strong> Processing & Roasting
                        </p>
                      </td>
                      <td width="50%" valign="top" style="text-align: right;">
                        <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #1C1310;">
                          <tr>
                            <td style="color: #5a504b;">Subtotal:</td>
                            <td style="font-weight: bold;">$${(order.subtotal || order.total || 0).toFixed(2)}</td>
                          </tr>
                          ${order.discount ? `
                          <tr>
                            <td style="color: #D99B26;">Discount:</td>
                            <td style="color: #D99B26; font-weight: bold;">-$${(order.discount || 0).toFixed(2)}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="color: #5a504b;">Shipping:</td>
                            <td style="font-weight: bold;">${order.shipping === 0 ? 'FREE' : '$' + (order.shipping || 0).toFixed(2)}</td>
                          </tr>
                          <tr style="border-top: 1px solid #1C1310;">
                            <td style="font-size: 15px; font-weight: bold; padding-top: 8px; color: #2D3E35;">Grand Total:</td>
                            <td style="font-size: 16px; font-weight: bold; padding-top: 8px; color: #2D3E35;">$${(order.total || 0).toFixed(2)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Track Order CTA Button -->
              <tr>
                <td style="padding: 0 40px 35px 40px; text-align: center;">
                  <div style="background-color: #2D3E35; border-radius: 12px; padding: 20px; text-align: center;">
                    <p style="color: #F7F4EE; margin: 0 0 12px 0; font-size: 13px;">
                      Track your order roasting progress and live delivery updates anytime:
                    </p>
                    <a href="http://localhost:5173" style="background-color: #D99B26; color: #1C1310; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 28px; border-radius: 30px; display: inline-block;">
                      Track Order #${order.id || 'BRW-9482'}
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F9F7F3; padding: 20px 40px; text-align: center; border-top: 1px solid #ECE7DE; font-size: 11px; color: #7a706b;">
                  © 2026 Brewly & Co. Roasters. All rights reserved.<br>
                  Sent with ❤ from Brewly Coffee Roastery (${senderEmail})
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: recipientEmail,
    subject: `☕ Order Confirmation #${order.id || 'BRW-9482'} - Brewly Coffee Roasters`,
    html: htmlContent
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️ SMTP Email dispatched successfully to ${recipientEmail}! Message ID: ${info.messageId}`);
  return info;
};

const sendStatusUpdateEmail = async (order, status, notifTitle, notifMessage) => {
  try {
    const transporter = createTransporter();
    const senderEmail = process.env.SMTP_USER;
    const senderName = process.env.SMTP_FROM_NAME || 'Brewly Coffee';

    const recipientEmail = order.customerEmail;
    const recipientName = order.customerName || (recipientEmail ? recipientEmail.split('@')[0] : 'Valued Customer');

    if (!recipientEmail) {
      console.log(`⚠️ Order #${order.id || ''} has no customer email address. Status update email skipped.`);
      return;
    }

    let statusColor = '#2D3E35';
    let statusIcon = '📦';
    if (status === 'Shipped') {
      statusColor = '#D99B26';
      statusIcon = '🚚';
    } else if (status === 'Out for Delivery') {
      statusColor = '#2563EB';
      statusIcon = '🛵';
    } else if (status === 'Delivered') {
      statusColor = '#16A34A';
      statusIcon = '🎉';
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${notifTitle} - Brewly Coffee</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F7F4EE; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1C1310;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F4EE; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #E6E1D7;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #1C1310; padding: 30px 40px; text-align: center;">
                  <h1 style="color: #F7F4EE; margin: 0; font-family: Georgia, serif; font-size: 28px; letter-spacing: 1px;">
                    Brewly & Co.
                  </h1>
                  <p style="color: #D99B26; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                    ORDER DELIVERY UPDATE
                  </p>
                </td>
              </tr>

              <!-- Status Announcement Card -->
              <tr>
                <td style="padding: 30px 40px 15px 40px;">
                  <div style="background-color: #F9F7F3; border-left: 5px solid ${statusColor}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <div style="font-size: 28px; margin-bottom: 6px;">${statusIcon}</div>
                    <h2 style="margin: 0 0 8px 0; color: #1C1310; font-family: Georgia, serif; font-size: 22px;">
                      ${notifTitle}
                    </h2>
                    <p style="margin: 0; color: #2D3E35; font-size: 16px; font-weight: bold; line-height: 1.5;">
                      "${notifMessage}"
                    </p>
                  </div>

                  <p style="margin: 0; color: #5a504b; font-size: 14px; line-height: 1.6;">
                    Hello <strong>${recipientName}</strong>, your order <strong style="color: #2D3E35;">#${order.id || 'Order'}</strong> delivery status has been updated.
                  </p>
                </td>
              </tr>

              <!-- Order Summary Info -->
              <tr>
                <td style="padding: 10px 40px 20px 40px;">
                  <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #F9F7F3; border-radius: 12px; border: 1px solid #ECE7DE; font-size: 13px;">
                    <tr style="border-bottom: 1px solid #ECE7DE;">
                      <td style="color: #5a504b;">Order ID:</td>
                      <td style="font-weight: bold; text-align: right; color: #1C1310;">#${order.id || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ECE7DE;">
                      <td style="color: #5a504b;">Delivery Status:</td>
                      <td style="font-weight: bold; text-align: right; color: ${statusColor};">${status}</td>
                    </tr>
                    <tr>
                      <td style="color: #5a504b;">Customer Email:</td>
                      <td style="font-weight: bold; text-align: right; color: #1C1310;">${recipientEmail}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Track Order CTA Button -->
              <tr>
                <td style="padding: 0 40px 35px 40px; text-align: center;">
                  <div style="background-color: #2D3E35; border-radius: 12px; padding: 20px; text-align: center;">
                    <p style="color: #F7F4EE; margin: 0 0 12px 0; font-size: 13px;">
                      Check live tracking and notification history in your account:
                    </p>
                    <a href="http://localhost:5173" style="background-color: #D99B26; color: #1C1310; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 28px; border-radius: 30px; display: inline-block;">
                      View Order Portal
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F9F7F3; padding: 20px 40px; text-align: center; border-top: 1px solid #ECE7DE; font-size: 11px; color: #7a706b;">
                  © 2026 Brewly & Co. Roasters. All rights reserved.<br>
                  Sent with ❤ from Brewly Coffee Roastery (${senderEmail})
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: recipientEmail,
      subject: `☕ Order #${order.id || ''} Update: ${notifMessage}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Status update email dispatched to ${recipientEmail} for Order #${order.id}: "${notifMessage}" (Message ID: ${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send status update email for Order #${order.id}:`, err.message);
  }
};

module.exports = {
  createTransporter,
  sendOrderConfirmationEmail,
  sendStatusUpdateEmail
};
