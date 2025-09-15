#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Testing MCP Servers Installation\n');

const servers = [
  {
    name: 'Sequential Thinking',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
    installed: true
  },
  {
    name: 'Filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '--rootDir', '.'],
    installed: true
  },
  {
    name: 'Memory',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-memory'],
    installed: true
  },
  {
    name: 'Magic UI',
    command: 'npx',
    args: ['-y', '@magicuidesign/mcp'],
    installed: true
  },
  {
    name: 'Playwright',
    command: 'npx',
    args: ['-y', '@executeautomation/playwright-mcp-server'],
    installed: true
  },
  {
    name: 'Puppeteer',
    command: 'npx',
    args: ['-y', 'puppeteer-mcp-server'],
    installed: true
  }
];

async function testServer(server) {
  return new Promise((resolve) => {
    console.log(`Testing ${server.name}...`);
    
    const proc = spawn(server.command, [...server.args, '--version'], {
      stdio: 'pipe',
      timeout: 5000
    });

    let output = '';
    let error = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr.on('data', (data) => {
      error += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0 || output.includes('running') || error.includes('running')) {
        console.log(`✅ ${server.name}: Working`);
        resolve(true);
      } else {
        console.log(`❌ ${server.name}: Not available or error`);
        resolve(false);
      }
    });

    proc.on('error', (err) => {
      console.log(`❌ ${server.name}: Error - ${err.message}`);
      resolve(false);
    });

    // Kill process after 3 seconds (for servers that run continuously)
    setTimeout(() => {
      try {
        proc.kill();
      } catch (e) {
        // Process might have already exited
      }
    }, 3000);
  });
}

async function main() {
  const results = [];
  
  for (const server of servers) {
    const result = await testServer(server);
    results.push({ name: server.name, working: result });
  }

  console.log('\n📊 Summary:');
  console.log('='.repeat(40));
  
  const working = results.filter(r => r.working);
  const notWorking = results.filter(r => !r.working);
  
  if (working.length > 0) {
    console.log('\n✅ Working servers:');
    working.forEach(s => console.log(`  - ${s.name}`));
  }
  
  if (notWorking.length > 0) {
    console.log('\n❌ Not working servers:');
    notWorking.forEach(s => console.log(`  - ${s.name}`));
  }
  
  console.log(`\n📈 Total: ${working.length}/${servers.length} servers working`);
  
  // Save configuration
  const config = {
    tested: new Date().toISOString(),
    working: working.map(s => s.name),
    notWorking: notWorking.map(s => s.name),
    totalServers: servers.length,
    workingCount: working.length
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'mcp-test-results.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('\n💾 Results saved to mcp-test-results.json');
}

main().catch(console.error);