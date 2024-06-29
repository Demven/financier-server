import { ServerClient } from 'postmark';

const { POSTMARK_API_ID = '' } = process.env;

const client = new ServerClient(POSTMARK_API_ID);

export enum EMAIL_TEMPLATE {
  CONFIRM_EMAIL = 36080229,
  RESET_PASSWORD = 36437016,
}

export async function sendTemplateEmail (templateId:EMAIL_TEMPLATE, {
  fromEmail = 'noreply@thefinancier.app',
  toEmail = 'support@thefinancier.app',
  fullName,
  actionUrl,
}:{
  fromEmail: string;
  toEmail: string;
  fullName?: string;
  actionUrl: string;
}) {
  return client.sendEmailWithTemplate({
    TemplateId: templateId,
    From: fromEmail,
    To: toEmail,
    TemplateModel: {
      'product_url': 'www.thefinancier.app',
      'product_name': 'Financier',
      'name': fullName,
      'user_email': toEmail,
      'action_url': actionUrl,
      'support_email': 'support@thefinancier.app',
      'company_name': 'Financier',
      'company_address': 'Boston, MA, USA',
    },
  });
}
