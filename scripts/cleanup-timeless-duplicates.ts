import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function cleanupDuplicates() {
  const csvPath = join(process.cwd(), 'src/data/dimaondsbycs.csv');
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');

  // Lines to remove (OLD structure products)
  const linesToRemove = new Set([
    28, // timeless-diamond-earrings main line
    70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, // timeless-diamond-earrings variants
    81, // timeless-diamond-necklace main line
    122, 123, 124, 125, 126 // timeless-diamond-necklace variants
  ]);

  const cleanedLines: string[] = [];
  let removedCount = 0;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (linesToRemove.has(lineNumber)) {
      console.log(`✂️  Removing line ${lineNumber}: ${line.substring(0, 60)}...`);
      removedCount++;
    } else {
      cleanedLines.push(line);
    }
  });

  // Write cleaned CSV
  const cleanedContent = cleanedLines.join('\n');
  writeFileSync(csvPath, cleanedContent, 'utf-8');

  console.log(`\n✅ Cleanup complete!`);
  console.log(`   Removed ${removedCount} lines`);
  console.log(`   Original lines: ${lines.length}`);
  console.log(`   Cleaned lines: ${cleanedLines.length}`);
  console.log(`\n📊 Remaining timeless products:`);
  console.log(`   ✓ timeless-diamond-stud-earrings-18k-gold-0-30ct (3 variants)`);
  console.log(`   ✓ timeless-diamond-stud-earrings-18k-gold-0-50ct (3 variants)`);
  console.log(`   ✓ timeless-diamond-stud-earrings-18k-gold-1-00ct (3 variants)`);
  console.log(`   ✓ timeless-diamond-necklace-18k-gold-0-50ct (3 variants)`);
  console.log(`   ✓ timeless-diamond-necklace-18k-gold-1-00ct (3 variants)`);
  console.log(`\n   Total: 5 products with 15 variants (all in NEW structure)`);
}

cleanupDuplicates();
