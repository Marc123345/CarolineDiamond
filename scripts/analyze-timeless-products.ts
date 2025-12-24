import { readFileSync } from 'fs';
import { join } from 'path';

interface CSVRow {
  handle: string;
  title: string;
  optionValue: string;
  option2Value: string;
  price: string;
  sku: string;
  lineNumber: number;
}

function parseCSV(filePath: string): CSVRow[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const columns = line.split(',');
    const handle = columns[0];

    // Only process timeless products
    if (handle.includes('timeless-diamond')) {
      rows.push({
        handle,
        title: columns[1],
        optionValue: columns[9], // Metal color
        option2Value: columns[12], // Carat option
        price: columns[22],
        sku: columns[17],
        lineNumber: i + 1
      });
    }
  }

  return rows;
}

function analyzeTimelessProducts() {
  const csvPath = join(process.cwd(), 'src/data/dimaondsbycs.csv');
  const rows = parseCSV(csvPath);

  console.log('=== TIMELESS PRODUCTS ANALYSIS ===\n');

  // Group by handle
  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.handle]) acc[row.handle] = [];
    acc[row.handle].push(row);
    return acc;
  }, {} as Record<string, CSVRow[]>);

  console.log(`Total unique handles: ${Object.keys(grouped).length}\n`);

  // Analyze each product
  for (const [handle, variants] of Object.entries(grouped)) {
    console.log(`\n📦 ${handle}`);
    console.log(`   Lines: ${variants.map(v => v.lineNumber).join(', ')}`);
    console.log(`   Variants: ${variants.length}`);

    const hasTitle = variants[0].title !== '';
    console.log(`   Has description: ${hasTitle ? 'YES' : 'NO'}`);

    // Check for Natural Diamond variants with €0.00
    const zeroPrice = variants.filter(v =>
      parseFloat(v.price) === 0 && v.option2Value.includes('Natural')
    );
    if (zeroPrice.length > 0) {
      console.log(`   ⚠️  ${zeroPrice.length} Natural Diamond variants with €0.00 (lines: ${zeroPrice.map(v => v.lineNumber).join(', ')})`);
    }

    // Check metal color consistency
    const metalColors = [...new Set(variants.map(v => v.optionValue))];
    console.log(`   Metal colors: ${metalColors.join(', ')}`);
    if (metalColors.some(c => c.includes('whte-gold') || c === 'white' || c === 'yellow-gold' || c === 'rose-gold')) {
      console.log(`   ⚠️  Inconsistent metal color naming`);
    }

    // Check carat options
    const caratOptions = [...new Set(variants.filter(v => v.option2Value).map(v => v.option2Value))];
    console.log(`   Carat options: ${caratOptions.join(', ')}`);

    // Check pricing
    const prices = [...new Set(variants.map(v => v.price))];
    console.log(`   Prices: ${prices.join(', ')}`);
  }

  // Identify structure types
  console.log('\n\n=== STRUCTURE ANALYSIS ===\n');

  const oldStructure = Object.keys(grouped).filter(h =>
    (h === 'timeless-diamond-earrings' || h === 'timeless-diamond-necklace') &&
    !h.includes('-18k-gold-')
  );

  const newStructure = Object.keys(grouped).filter(h =>
    h.includes('timeless-diamond') && h.includes('-18k-gold-')
  );

  console.log('OLD STRUCTURE (combined variants):');
  oldStructure.forEach(h => console.log(`  - ${h} (${grouped[h].length} variants)`));

  console.log('\nNEW STRUCTURE (separate products):');
  newStructure.forEach(h => console.log(`  - ${h} (${grouped[h].length} variants)`));

  // Recommendations
  console.log('\n\n=== RECOMMENDATIONS ===\n');
  console.log('1. Remove OLD structure products (timeless-diamond-earrings, timeless-diamond-necklace)');
  console.log('2. Remove all "Natural Diamond" variants with €0.00 price');
  console.log('3. Standardize metal colors to: "Yellow Gold", "White Gold", "Rose Gold"');
  console.log('4. Create NEW structure products for earrings:');
  console.log('   - timeless-diamond-earrings-18k-gold-0-30ct');
  console.log('   - timeless-diamond-earrings-18k-gold-0-50ct');
  console.log('   - timeless-diamond-earrings-18k-gold-1-00ct');
  console.log('5. Verify all products have 3 variants (Yellow, White, Rose Gold)');
}

analyzeTimelessProducts();
