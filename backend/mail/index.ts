import ejs from "ejs";

class MailService {
  async sendMail({
    to,
    subject,
    otp,
    name,
    authType,
  }: {
    to: string;
    subject: string;
    otp: string;
    name: string;
    authType: "Login" | "Signup";
  }) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
          accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          sender: {
            name: process.env.SENDER_NAME!,
            email: process.env.SENDER_EMAIL!,
          },
          to: [
            {
              email: to,
              name: name,
            },
          ],
          subject: subject,
          htmlContent: await ejs.renderFile("mail/templates/otp.ejs", {
            name: name,
            authType: authType,
            otp: otp,
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to send email:", errorData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async sendSubscriptionConfirmation({ to }: { to: string }) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
          accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          sender: {
            name: process.env.SENDER_NAME!,
            email: process.env.SENDER_EMAIL!,
          },
          to: [
            {
              email: to,
            },
          ],
          subject: "Thank You for Subscribing!",
          htmlContent: await ejs.renderFile("mail/templates/subscribe.ejs"),
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export default MailService;
