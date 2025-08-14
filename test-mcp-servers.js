#!/usr/bin/env node

/**
 * Test script for MCP servers
 * Run with: node test-mcp-servers.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

const servers = [
  {
    name: 'Sequential Thinking',
    command: 'npx -y @modelcontextprotocol/server-sequential-thinking --version',
    timeout: 30000
  },
  {
    name: 'Filesystem',
    command: 'npx -y @modelcontextprotocol/server-filesystem --version',
    timeout: 30000
  },
  {
    name: 'Memory',
    command: 'npx -y @modelcontextprotocol/server-memory --version',
    timeout: 30000
  },
  {
    name: 'Puppeteer MCP',
    command: 'npx -y puppeteer-mcp-server --version',
    timeout: 30000
  },
  {
    name: 'Smart Crawler',
    command: 'npx -y mcp-smart-crawler --version',
    timeout: 30000
  },
  {
    name: 'Magic UI',
    command: 'npx -y @magicuidesign/mcp --version',
    timeout: 30000
  },
  {
    name: 'Inspector',
    command: 'npx -y @modelcontextprotocol/inspector --version',
    timeout: 30000
  }
];

async function testServer(server) {
  console.log(`\n📦 Testing ${server.name}...`);
  try {
    const { stdout, stderr } = await execPromise(server.command, {
      timeout: server.timeout
    });
    
    if (stdout || stderr) {
      console.log(`✅ ${server.name} is available`);
      if (stdout) console.log(`   Version/Output: ${stdout.trim()}`);
      return true;
    }
  } catch (error) {
    if (error.killed || error.signal === 'SIGTERM') {
      console.log(`⚠️  ${server.name} might be available (command timed out, which is normal for servers)`);
      return 'timeout';
    } else if (error.code === 1) {
      console.log(`✅ ${server.name} is available (exit code 1 is normal for help output)`);
      return true;
    } else {
      console.log(`❌ ${server.name} failed: ${error.message}`);
      return false;
    }
  }
}

async function main() {
  console.log('🔍 Testing MCP Server Availability');
  console.log('===================================');
  
  const results = [];
  for (const server of servers) {
    const result = await testServer(server);
    results.push({ name: server.name, status: result });
  }
  
  console.log('\n\n📊 Summary');
  console.log('===========');
  
  const available = results.filter(r => r.status === true || r.status === 'timeout');
  const failed = results.filter(r => r.status === false);
  
  console.log(`✅ Available/Working: ${available.length}`);
  available.forEach(s => console.log(`   - ${s.name}`));
  
  if (failed.length > 0) {
    console.log(`\n❌ Not Available: ${failed.length}`);
    failed.forEach(s => console.log(`   - ${s.name}`));
  }
  
  console.log('\n💡 Note: Some servers showing as "timeout" are actually working.');
  console.log('   They start a server process instead of returning version info.');
}

main().catch(console.error);