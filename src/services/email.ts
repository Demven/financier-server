import { ServerClient } from 'postmark';

const {
  UI_HOST = '',
  POSTMARK_API_ID = '',
} = process.env;

const client = new ServerClient(POSTMARK_API_ID);

enum EMAIL_TEMPLATE {
  CONFIRM_EMAIL = 36080229,
}

export async function sendTemplateEmail ({
  fromEmail = 'noreply@thefinancier.app',
  toEmail = 'support@thefinancier.app',
  fullName,
  token,
}:{
  fromEmail: string;
  toEmail: string;
  fullName: string;
  token: string;
}) {
  return client.sendEmailWithTemplate({
    TemplateId: EMAIL_TEMPLATE.CONFIRM_EMAIL,
    From: fromEmail,
    To: toEmail,
    TemplateModel: {
      'product_url': 'www.thefinancier.app',
      'product_name': 'Financier',
      'name': fullName,
      'user_email': toEmail,
      'action_url': `${UI_HOST}/confirm-email?token=${token}`,
      'support_email': 'support@thefinancier.app',
      'company_name': 'Financier',
      'company_address': 'Boston, MA, USA',
    },
  });
}
