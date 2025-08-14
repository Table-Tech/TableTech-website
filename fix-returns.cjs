const fs = require('fs');

function addMissingReturns() {
  const filePath = 'c:/Users/Wish/Downloads/github-repo/Systemen/Team/Tabletech/TableTech-website/api/src/routes/appointmentsV2.ts';
  
  try {
    console.log('🔧 Adding missing return statements...');
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find patterns where res.status().json() is called but missing return;
    // Look for patterns like:
    // res.status(XXX).json({
    //   ...
    // });
    // And add return; after them if it's missing
    
    // Pattern 1: res.status().json() followed by } and not return;
    content = content.replace(
      /(res\.status\(\d+\)\.json\(\{[\s\S]*?\}\);)\s*(?!return;)/g,
      '$1\n      return;'
    );
    
    // Also add return types to all remaining async handlers
    content = content.replace(
      /router\.(get|post|delete|put)\([^,]+,\s*async \(req: Request, res: Response\)(?!\s*: Promise<void>) =>/g,
      'router.$1($2, async (req: Request, res: Response): Promise<void> =>'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Added missing return statements');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addMissingReturns();
