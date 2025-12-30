#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../components');

const replacements = [
  // Fix context imports
  { from: /from ['"]\.\.\/context\//g, to: "from '../../context/" },
  { from: /from ['"]\.\.\/hooks\//g, to: "from '../../hooks/" },
  { from: /from ['"]\.\.\/utils\//g, to: "from '../../utils/" },
  { from: /from ['"]\.\.\/lib\//g, to: "from '../../lib/" },
  { from: /from ['"]\.\.\/config\//g, to: "from '../../config/" },
  { from: /from ['"]\.\.\/types\//g, to: "from '../../types/" },
  { from: /from ['"]\.\.\/data\//g, to: "from '../../data/" },

  // Fix component-to-component imports that should go to ui
  { from: /from ['"]\.\/CartIcon['"]/g, to: "from '../ui/CartIcon'" },
  { from: /from ['"]\.\/WishlistIcon['"]/g, to: "from '../ui/WishlistIcon'" },
  { from: /from ['"]\.\/SearchModal['"]/g, to: "from '../ui/SearchModal'" },
  { from: /from ['"]\.\/SearchBar['"]/g, to: "from '../ui/SearchBar'" },
  { from: /from ['"]\.\/T['"]/g, to: "from '../ui/T'" },
  { from: /from ['"]\.\/OptimizedImage['"]/g, to: "from '../ui/OptimizedImage'" },
  { from: /from ['"]\.\/ErrorBoundary['"]/g, to: "from '../ui/ErrorBoundary'" },
  { from: /from ['"]\.\/PageTransition['"]/g, to: "from '../ui/PageTransition'" },
  { from: /from ['"]\.\/Breadcrumbs['"]/g, to: "from '../ui/Breadcrumbs'" },

  // Fix React Router imports
  { from: /from ['"]react-router-dom['"]/g, to: "from 'next/navigation'" },
  { from: /useNavigate/g, to: 'useRouter' },
  { from: /useLocation\(\)/g, to: 'usePathname()' },
  { from: /const location = usePathname\(\)/g, to: 'const pathname = usePathname()' },
  { from: /navigate\(/g, to: 'router.push(' },
  { from: /location\.pathname/g, to: 'pathname' },
  { from: /location\.search/g, to: 'searchParams' },

  // Fix environment variables
  { from: /import\.meta\.env\.VITE_/g, to: 'process.env.NEXT_PUBLIC_' },
  { from: /import\.meta\.env\.DEV/g, to: "process.env.NODE_ENV === 'development'" },
  { from: /import\.meta\.env\.MODE/g, to: 'process.env.NODE_ENV' },

  // Fix Link component
  { from: /import { Link } from ['"]next\/navigation['"]/g, to: "import Link from 'next/link'" },
  { from: /\n(\s+)to=/gm, to: '\n$1href=' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add 'use client' if not present and it's a .tsx file
  if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
    content = "'use client';\n\n" + content;
    modified = true;
  }

  // Apply all replacements
  replacements.forEach(({ from, to }) => {
    const newContent = content.replace(from, to);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir) {
  let filesModified = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      filesModified += walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (processFile(filePath)) {
        filesModified++;
        console.log(`✓ Fixed: ${path.relative(componentsDir, filePath)}`);
      }
    }
  });

  return filesModified;
}

console.log('🔧 Fixing component imports...\n');
const total = walkDir(componentsDir);
console.log(`\n✅ Fixed ${total} files!`);
