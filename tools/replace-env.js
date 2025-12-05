const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/environments/environment.ts');

let content = fs.readFileSync(
  path.join(__dirname, '../src/environments/environment.template.ts'),
  'utf8'
);

content = content
  .replace('__SUPABASE_URL__', process.env.SUPABASE_URL)
  .replace('__SUPABASE_ANON_KEY__', process.env.SUPABASE_ANON_KEY);

fs.writeFileSync(filePath, content);
console.log('Environment file generated successfully');