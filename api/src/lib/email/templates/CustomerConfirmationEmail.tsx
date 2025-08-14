import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface CustomerConfirmationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  restaurant?: string;
  preferredDate?: string;
  preferredTime?: string;
  message: string;
}

export const CustomerConfirmationEmail = ({
  firstName,
  lastName,
  email,
  phone,
  restaurant,
  preferredDate,
  preferredTime,
  message,
}: CustomerConfirmationEmailProps) => {
  const previewText = `Bevestiging: we hebben je aanvraag ontvangen`;
  
  // TableTech logo as base64 - simple SVG version for reliability
  const logoSvg = `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="8" fill="#E86C28"/>
      <text x="60" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">TableTech</text>
    </svg>
  `).toString('base64')}`;

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        {/* Decorative top bar */}
        <div style={decorativeBar}></div>
        
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src={logoSvg}
              width="120"
              height="40"
              alt="TableTech"
              style={logo}
            />
          </Section>

          {/* Header */}
          <Heading style={h1}>Bedankt voor je aanvraag!</Heading>
          
          <Text style={text}>
            Beste {firstName},
          </Text>
          
          <Text style={text}>
            We hebben je aanvraag voor een afspraak in goede orde ontvangen! 
            We nemen binnen 1 werkdag contact met je op om de afspraak te bevestigen.
          </Text>

          {preferredDate && preferredTime && (
            <Section style={appointmentHighlight}>
              <Text style={appointmentText}>
                📅 <strong>Jouw voorkeur:</strong> {preferredDate} om {preferredTime}
              </Text>
              <Text style={appointmentSubtext}>
                (Telefonisch gesprek van 30 minuten)
              </Text>
            </Section>
          )}

          {/* Details section */}
          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>
              Details van je aanvraag
            </Heading>
            
            <Text style={detailItem}>
              <strong>Naam:</strong> {firstName} {lastName}
            </Text>
            <Text style={detailItem}>
              <strong>E-mail:</strong> {email}
            </Text>
            {phone && (
              <Text style={detailItem}>
                <strong>Telefoon:</strong> {phone}
              </Text>
            )}
            {restaurant && (
              <Text style={detailItem}>
                <strong>Restaurant:</strong> {restaurant}
              </Text>
            )}
            {preferredDate && (
              <Text style={detailItem}>
                <strong>Voorkeursdatum:</strong> {preferredDate}
              </Text>
            )}
            {preferredTime && (
              <Text style={detailItem}>
                <strong>Voorkeurstijd:</strong> {preferredTime}
              </Text>
            )}
            <Text style={detailItem}>
              <strong>Bericht:</strong>
            </Text>
            <Text style={messageBox}>
              {message}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Call to action */}
          <Section style={ctaSection}>
            <Text style={{...text, textAlign: 'center'}}>
              Mocht je vragen hebben of de afspraak willen wijzigen, 
              neem dan gerust contact met ons op:
            </Text>
            
            <Button
              href={`mailto:info@tabletech.nl?subject=Afspraak aanvraag`}
              style={button}
            >
              Contact opnemen
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          
          <Section style={footer}>
            <Img
              src={logoSvg}
              width="80"
              height="27"
              alt="TableTech"
              style={footerLogo}
            />
            <Text style={footerText}>
              TableTech | Biezelingeplein 32, 3086 SB Rotterdam, Nederland
            </Text>
            <Link href="https://tabletech.nl" style={footerLink}>
              https://tabletech.nl
            </Link>
            <Text style={footerText}>
              Je ontvangt deze e-mail omdat je een afspraak hebt aangevraagd via onze website.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles - Dark Theme
const main = {
  backgroundColor: '#0a0a0a',
  backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  minHeight: '100vh',
  padding: '40px 20px',
};

const container = {
  backgroundColor: '#1a1a1a',
  backdropFilter: 'blur(10px)',
  margin: '0 auto',
  padding: '32px',
  marginBottom: '64px',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(232, 108, 40, 0.3)',
  maxWidth: '600px',
};

const logoSection = {
  padding: '24px',
  textAlign: 'left' as const,
  background: 'rgba(232, 108, 40, 0.1)',
  borderRadius: '12px',
  margin: '-32px -32px 32px -32px',
};

const logo = {
  margin: '0',
  borderRadius: '8px',
  padding: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(232, 108, 40, 0.3)',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '40px',
  margin: '0 0 24px',
  padding: '0',
  textAlign: 'left' as const,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};

const h2 = {
  color: '#FFB366',
  fontSize: '22px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0 0 16px',
  textAlign: 'left' as const,
};

const text = {
  color: '#d1d5db',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
  padding: '0',
  textAlign: 'left' as const,
};

const appointmentHighlight = {
  background: 'linear-gradient(135deg, rgba(232, 108, 40, 0.2), rgba(255, 179, 102, 0.1))',
  borderRadius: '12px',
  margin: '24px 0',
  padding: '24px',
  border: '2px solid rgba(232, 108, 40, 0.4)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  textAlign: 'left' as const,
};

const appointmentText = {
  color: '#ffffff',
  fontSize: '18px',
  lineHeight: '24px',
  margin: '0 0 8px',
  fontWeight: '600',
  textAlign: 'left' as const,
};

const appointmentSubtext = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'left' as const,
};

const detailsSection = {
  background: 'rgba(232, 108, 40, 0.05)',
  borderRadius: '12px',
  margin: '24px 0',
  padding: '24px',
  border: '1px solid rgba(232, 108, 40, 0.2)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
};

const detailItem = {
  color: '#f3f4f6',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 12px',
  fontWeight: '500',
  textAlign: 'left' as const,
};

const messageBox = {
  backgroundColor: 'rgba(232, 108, 40, 0.1)',
  border: '2px solid rgba(232, 108, 40, 0.3)',
  borderRadius: '8px',
  color: '#f3f4f6',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '12px 0 16px',
  padding: '16px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  whiteSpace: 'pre-wrap' as const,
  textAlign: 'left' as const,
};

const hr = {
  borderColor: 'rgba(232, 108, 40, 0.3)',
  margin: '20px 0',
};

const ctaSection = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  background: 'linear-gradient(135deg, #E86C28, #FFB366)',
  borderRadius: '12px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '100%',
  padding: '16px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  boxShadow: '0 4px 12px rgba(232, 108, 40, 0.3)',
  border: 'none',
  transition: 'all 0.3s ease',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
  background: 'rgba(232, 108, 40, 0.05)',
  borderRadius: '12px',
  margin: '24px -32px -32px -32px',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const footerText = {
  color: '#1f2937',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 4px',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#FFB366',
  fontSize: '12px',
  lineHeight: '16px',
  textDecoration: 'underline',
};

const footerLogo = {
  margin: '0 auto 16px auto',
  borderRadius: '6px',
  padding: '8px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(232, 108, 40, 0.2)',
  display: 'block',
};

const decorativeBar = {
  height: '6px',
  background: 'linear-gradient(90deg, #E86C28, #FFB366, #E86C28)',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto 20px',
  borderRadius: '3px',
};

export default CustomerConfirmationEmail;