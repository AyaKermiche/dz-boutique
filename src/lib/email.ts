type SendEmailParams = {
  to: string
  subject: string
  htmlContent: string
}

export async function sendEmail({ to, subject, htmlContent }: SendEmailParams) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: 'DZ Boutique',
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Brevo error:', error)
      return false
    }

    console.log('Email envoye avec succes')
    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}