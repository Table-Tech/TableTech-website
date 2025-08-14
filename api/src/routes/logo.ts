import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Serve email logo
router.get('/logo', (_req, res) => {
  try {
    // Try the email logo first, then fallback to public logo
    const emailLogoPath = path.join(__dirname, '..', 'lib', 'email', 'logo', 'email-logo.png');
    const publicLogoPath = path.join(__dirname, '..', '..', '..', 'public', 'logo.png');
    
    let logoPath = emailLogoPath;
    if (!fs.existsSync(emailLogoPath) && fs.existsSync(publicLogoPath)) {
      logoPath = publicLogoPath;
    }
    
    // Check if file exists
    if (!fs.existsSync(logoPath)) {
      return res.status(404).json({ error: 'Logo not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Send the file
    return res.sendFile(logoPath);
  } catch (error) {
    console.error('Error serving logo:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
