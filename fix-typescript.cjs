const fs = require('fs');

// Fix TypeScript return statement issues
function fixTypeScriptReturns() {
  const files = [
    'c:/Users/Wish/Downloads/github-repo/Systemen/Team/Tabletech/TableTech-website/api/src/lib/validation/appointmentV2.ts',
    'c:/Users/Wish/Downloads/github-repo/Systemen/Team/Tabletech/TableTech-website/api/src/routes/appointmentsV2.ts'
  ];

  files.forEach(filePath => {
    try {
      console.log(`🔧 Fixing ${filePath}...`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace "return res.status" with "res.status" and add return on next line
      content = content.replace(/return res\.status\(/g, 'res.status(');
      
      // Add Promise<void> return types to async route handlers that don't have them
      content = content.replace(
        /async \(req: Request, res: Response\) => {/g,
        'async (req: Request, res: Response): Promise<void> => {'
      );
      
      // Fix error handling - cast unknown error to Error
      content = content.replace(
        /if \(error\.message\.includes/g,
        'if (error instanceof Error && error.message.includes'
      );
      
      content = content.replace(
        /error: error\.message,/g,
        'error: error instanceof Error ? error.message : "Unknown error",'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${filePath}`);
      
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  });
}

fixTypeScriptReturns();
