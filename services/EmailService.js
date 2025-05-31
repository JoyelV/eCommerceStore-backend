const nodemailer = require("nodemailer");

class EmailService {
  constructor(transporter) {
    this.transporter = transporter;
  }

  async sendOrderEmail(email, order, status) {
    if (!email) {
      console.error("No email provided for customer:", {
        orderNumber: order.orderNumber,
      });
      throw new Error("No email provided for customer");
    }

    const subject =
      status === "Approved"
        ? "Order Confirmation - Thank You for Your Purchase!"
        : "Order Failed - Action Required";

    // Generate email HTML content based on order status
    const html =
      status === "Approved"
        ? `
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
        <tr>
          <td style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <img src=${process.env.FRONTEND_URL} alt="eCommerce Store Logo" style="max-width: 150px; height: auto;" />
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 30px;">
            <h1 style="font-size: 24px; color: #1f2937; margin: 0 0 20px; text-align: center;">Order Confirmed: ${
              order.orderNumber
            }</h1>
            <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px; text-align: center;">
              Thank you for your purchase! We’re excited to get your order ready.
            </p>
            ${order.items
              .map(
                (item) => `
                  <!-- Product Image -->
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 20px;">
                    <tr>
                      <td style="text-align: center;">
                        <img src="${item.image}" alt="${
                  item.name
                }" style="max-width: 150px; height: auto; border-radius: 8px;" />
                      </td>
                    </tr>
                  </table>
                  <!-- Order Details -->
                  <table cellpadding="10" cellspacing="0" border="0" style="width: 100%; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                      <td style="font-size: 16px; color: #4b5563;">
                        <strong style="color: #1f2937;">Product:</strong> ${
                          item.name
                        }
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; color: #4b5563;">
                        <strong style="color: #1f2937;">Variant:</strong> ${
                          item.variant.color
                        }, ${item.variant.size}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; color: #4b5563;">
                        <strong style="color: #1f2937;">Quantity:</strong> ${
                          item.quantity
                        }
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; color: #4b5563;">
                        <strong style="color: #1f2937;">Total:</strong> $${(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </table>
                `
              )
              .join("")}
            <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px;">
              <strong style="color: #1f2937;">Shipping to:</strong><br />
              ${order.customer.name}<br />
              ${order.customer.address}, ${order.customer.city}, ${
            order.customer.state
          } ${order.customer.zip}<br />
              Phone: ${order.customer.phone}<br />
              Email: ${order.customer.email}
            </p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/${
                order.orderNumber
              }" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                View Your Order
              </a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
            <p style="margin: 0 0 10px;">Thank you for shopping with us!</p>
            <p style="margin: 0 0 10px;">
              Need help? <a href="mailto:support@store.com" style="color: #2563eb; text-decoration: underline;">Contact Support</a>
            </p>
            <p style="margin: 0 0 10px;">
              <a href="${process.env.FRONTEND_URL}" style="color: #2563eb; text-decoration: underline; margin: 0 5px;">Website</a> |
              <a href="#" style="color: #2563eb; text-decoration: underline; margin: 0 5px;">Facebook</a> |
              <a href="#" style="color: #2563eb; text-decoration: underline; margin: 0 5px;">Twitter</a>
            </p>
            <p style="margin: 0;">© 2025 eCommerce Store. All rights reserved.</p>
          </td>
        </tr>
      </table>
    `
        : `<table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
            <!-- Header -->
            <tr>
              <td style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                <img src="https://static.vecteezy.com/system/resources/previews/026/235/001/non_2x/ecommerce-logo-template-vector.jpg" alt="eCommerce Store Logo" style="max-width: 150px; height: auto;" />
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="background-color: #ffffff; padding: 30px;">
                <h1 style="font-size: 24px; color: #1f2937; margin: 0 0 20px; text-align: center;">Order Failed: ${order.orderNumber}</h1>
                <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px; text-align: center;">
                  We’re sorry, but your transaction could not be processed.
                </p>
                <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px; text-align: center;">
                  Please try again or contact our support team for assistance.
                </p>
                <!-- CTA -->
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/checkout" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                    Try Again
                  </a>
                </p>
                <p style="text-align: center; margin: 0;">
                  <a href="mailto:support@store.com" style="display: inline-block; padding: 12px 24px; background-color: #6b7280; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                    Contact Support
                  </a>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
                <p style="margin: 0 0 10px;">We’re here to help you complete your purchase.</p>
                <p style="margin: 0 0 10px;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #2563eb; text-decoration: underline; margin: 0 5px;">Website</a> |
                  <a href="#" style="color: #2563eb; text-decoration: underline; margin: 0 5px;">Facebook</a> |
                  <a href="#" style="color: #2563eb; text-decoration: underline; margin: 0 5px;">Twitter</a>
                </p>
                <p style="margin: 0;">&copy; 2025 eCommerce Store. All rights reserved.</p>
              </td>
            </tr>
          </table>
        `;

    try {
      const info = await this.transporter.sendMail({
        from: '"eCommerce Store" <no-reply@store.com>',
        to: email,
        subject,
        html,
      });
      console.log(`Email sent to ${email}:`, info.messageId);
    } catch (error) {
      // Centralized logging and error reporting
      console.error("Email sending failed:", {
        error: error.message,
        email,
        status,
        orderNumber: order.orderNumber,
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = EmailService;
