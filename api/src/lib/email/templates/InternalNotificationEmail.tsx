import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InternalNotificationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  restaurant?: string;
  preferredDate?: string;
  preferredTime?: string;
  subject?: string;
  message: string;
  requestId: string;
  pageUrl?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  ipHash: string;
  timestamp: string;
}

export const InternalNotificationEmail = ({
  firstName,
  lastName,
  email,
  phone,
  restaurant,
  preferredDate,
  preferredTime,
  subject,
  message,
  requestId,
  pageUrl,
  utm,
  ipHash,
  timestamp,
}: InternalNotificationEmailProps) => {
  const previewText = `Nieuwe afspraakaanvraag van ${firstName} ${lastName}`;

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        {/* Decorative top bar */}
        <div style={decorativeBar}></div>
        
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🔔 Nieuwe Afspraakaanvraag</Heading>
          </Section>

          {/* Contact Info */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Contactgegevens
            </Heading>
            
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Naam:</td>
                  <td style={valueCell}>{firstName} {lastName}</td>
                </tr>
                <tr>
                  <td style={labelCell}>E-mail:</td>
                  <td style={valueCell}>
                    <Link href={`mailto:${email}`} style={link}>
                      {email}
                    </Link>
                  </td>
                </tr>
                {phone && (
                  <tr>
                    <td style={labelCell}>Telefoon:</td>
                    <td style={valueCell}>
                      <Link href={`tel:${phone}`} style={link}>
                        {phone}
                      </Link>
                    </td>
                  </tr>
                )}
                {restaurant && (
                  <tr>
                    <td style={labelCell}>Restaurant:</td>
                    <td style={valueCell}>{restaurant}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Appointment Details */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Afspraakdetails
            </Heading>
            
            <table style={table}>
              <tbody>
                {preferredDate && (
                  <tr>
                    <td style={labelCell}>Voorkeursdatum:</td>
                    <td style={valueCell}>{preferredDate}</td>
                  </tr>
                )}
                {preferredTime && (
                  <tr>
                    <td style={labelCell}>Voorkeurstijd:</td>
                    <td style={valueCell}>{preferredTime}</td>
                  </tr>
                )}
                {subject && (
                  <tr>
                    <td style={labelCell}>Onderwerp:</td>
                    <td style={valueCell}>{subject}</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <Text style={label}>Bericht:</Text>
            <div style={messageBox}>
              {message}
            </div>
          </Section>

          <Hr style={hr} />

          {/* Technical Details */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Technische Details
            </Heading>
            
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Request ID:</td>
                  <td style={valueCell}>{requestId}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Timestamp:</td>
                  <td style={valueCell}>{timestamp}</td>
                </tr>
                <tr>
                  <td style={labelCell}>IP Hash:</td>
                  <td style={valueCell}>{ipHash}</td>
                </tr>
                {pageUrl && (
                  <tr>
                    <td style={labelCell}>Pagina:</td>
                    <td style={valueCell}>
                      <Link href={pageUrl} style={link}>
                        {pageUrl}
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {utm && (utm.source || utm.medium || utm.campaign) && (
              <>
                <Text style={label}>UTM Parameters:</Text>
                <table style={table}>
                  <tbody>
                    {utm.source && (
                      <tr>
                        <td style={labelCell}>Source:</td>
                        <td style={valueCell}>{utm.source}</td>
                      </tr>
                    )}
                    {utm.medium && (
                      <tr>
                        <td style={labelCell}>Medium:</td>
                        <td style={valueCell}>{utm.medium}</td>
                      </tr>
                    )}
                    {utm.campaign && (
                      <tr>
                        <td style={labelCell}>Campaign:</td>
                        <td style={valueCell}>{utm.campaign}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </Section>

          <Hr style={hr} />

          {/* Action Required */}
          <Section style={actionSection}>
            <Text style={actionText}>
              ⚡ <strong>Actie vereist:</strong> Neem binnen 1 werkdag contact op met de klant.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles - Donkere achtergrond voor interne emails
const main = {
  backgroundColor: '#1a1a1a',
  backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  minHeight: '100vh',
  padding: '60px 24px',
};

const container = {
  backgroundColor: '#2a2a2a',
  margin: '0 auto',
  padding: '32px',
  marginBottom: '64px',
  borderRadius: '16px',
  border: '2px solid rgba(232, 108, 40, 0.4)',
  maxWidth: '600px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
};

const header = {
  background: 'linear-gradient(135deg, #E86C28, #FFB366)',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '0 0 24px 0',
  textAlign: 'left' as const,
  boxShadow: '0 4px 12px rgba(232, 108, 40, 0.3)',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '36px',
  margin: '0',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  textAlign: 'left' as const,
};

const h2 = {
  color: '#FFB366',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '26px',
  margin: '0 0 16px',
  textAlign: 'left' as const,
};

const section = {
  padding: '24px 16px',
  background: 'rgba(0, 0, 0, 0.3)',
  borderBottom: '1px solid rgba(232, 108, 40, 0.3)',
  marginBottom: '16px',
  borderRadius: '8px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '20px',
  padding: '8px 24px 8px 0',
  verticalAlign: 'top' as const,
  width: '140px',
  textAlign: 'left' as const,
};

const valueCell = {
  color: '#ffffff',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '8px 0',
  verticalAlign: 'top' as const,
  textAlign: 'left' as const,
};

const label = {
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '20px',
  margin: '16px 0 12px',
  textAlign: 'left' as const,
};

const messageBox = {
  background: 'rgba(232, 108, 40, 0.2)',
  border: '2px solid rgba(232, 108, 40, 0.4)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '20px',
  margin: '16px 0',
  whiteSpace: 'pre-wrap' as const,
  textAlign: 'left' as const,
};

const hr = {
  borderColor: 'rgba(232, 108, 40, 0.4)',
  margin: '0',
};

const link = {
  color: '#FFB366',
  textDecoration: 'underline',
  fontWeight: '500',
};

const actionSection = {
  background: 'rgba(232, 108, 40, 0.3)',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0 0 0',
  textAlign: 'left' as const,
  borderTop: '2px solid #E86C28',
};

const actionText = {
  color: '#ffffff',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  fontWeight: '600',
  textAlign: 'left' as const,
};

const decorativeBar = {
  height: '6px',
  background: 'linear-gradient(90deg, #E86C28, #FFB366, #E86C28)',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto 20px',
  borderRadius: '3px',
};

export default InternalNotificationEmail;