/**
 * Product Data Validator & Normalizer
 * Detects and reports critical data quality issues:
 * - Variant-image mismatches
 * - Inconsistent metal color naming
 * - Pricing anomalies by shape
 * - Fragmented diamond type values
 * - Empty metafields
 */

import shopifyProductsDetailed from '../src/data/shopify_products_detailed.json';
import { normalizeMetal } from '../src/utils/metalColorUtils';

interface ValidationIssue {
  severity: 'critical' | 'warning' | 'info';
  product: string;
  productId: string;
  variantId?: string;
  issue: string;
  currentValue: any;
  suggestedFix?: string;
}

const issues: ValidationIssue[] = [];

function validateMetalColorConsistency() {
  console.log('\n🔍 Validating Metal Color Naming...\n');

  const metalVariations = new Map<string, Set<string>>();

  (shopifyProductsDetailed as any[]).forEach(product => {
    product.variants?.forEach((variant: any) => {
      const metalRaw = variant.selectedOptions?.find((opt: any) =>
        opt.name === 'Metal' || opt.name === 'Color' || opt.name === 'Material'
      )?.value;

      if (metalRaw) {
        const normalized = normalizeMetal(metalRaw);
        if (normalized) {
          if (!metalVariations.has(normalized)) {
            metalVariations.set(normalized, new Set());
          }
          metalVariations.get(normalized)!.add(metalRaw);
        } else {
          issues.push({
            severity: 'critical',
            product: product.title,
            productId: product.id,
            variantId: variant.id,
            issue: 'Metal color cannot be normalized',
            currentValue: metalRaw,
            suggestedFix: 'Update to: 18K White Gold, 18K Yellow Gold, or 18K Rose Gold'
          });
        }
      }
    });
  });

  // Report variations
  metalVariations.forEach((variations, canonical) => {
    if (variations.size > 1) {
      console.log(`⚠️  Canonical "${canonical}" has ${variations.size} variations:`);
      variations.forEach(v => console.log(`   - "${v}"`));
      console.log(`   Suggested: Consolidate to "18K ${canonical.charAt(0).toUpperCase() + canonical.slice(1)} Gold"\n`);
    }
  });
}

function validateDiamondTypeValues() {
  console.log('\n🔍 Validating Diamond Type Values...\n');

  const diamondTypeVariations = new Set<string>();

  (shopifyProductsDetailed as any[]).forEach(product => {
    product.tags?.forEach((tag: string) => {
      if (tag.toLowerCase().includes('lab') || tag.toLowerCase().includes('natural')) {
        diamondTypeVariations.add(tag);

        // Check for fragmented values
        if (tag.includes('0.50ct') || tag.includes('1.00ct') || tag.includes('1.50ct')) {
          issues.push({
            severity: 'critical',
            product: product.title,
            productId: product.id,
            issue: 'Diamond type includes carat weight',
            currentValue: tag,
            suggestedFix: 'Split into separate tags: "Lab-Grown" or "Natural" (without carat)'
          });
        }
      }
    });
  });

  console.log(`Found ${diamondTypeVariations.size} diamond type variations:`);
  diamondTypeVariations.forEach(v => console.log(`   - "${v}"`));
  console.log(`\n   Suggested: Use only "Lab-Grown" and "Natural"\n`);
}

function validateVariantImageMatches() {
  console.log('\n🔍 Validating Variant-Image Associations...\n');

  (shopifyProductsDetailed as any[]).forEach(product => {
    product.variants?.forEach((variant: any) => {
      const shapeOption = variant.selectedOptions?.find((opt: any) =>
        opt.name === 'Shape' || opt.name === 'Diamond Shape'
      )?.value;

      const variantImage = variant.image?.url || variant.image;

      if (shapeOption && variantImage) {
        const shapeInUrl = variantImage.toLowerCase();
        const shapeLower = shapeOption.toLowerCase();

        // Check if shape appears in image URL/alt
        if (!shapeInUrl.includes(shapeLower)) {
          issues.push({
            severity: 'warning',
            product: product.title,
            productId: product.id,
            variantId: variant.id,
            issue: 'Variant shape does not match assigned image',
            currentValue: { shape: shapeOption, image: variantImage },
            suggestedFix: `Assign image containing "${shapeOption}" to this variant`
          });
        }
      }
    });
  });
}

function validatePricingConsistency() {
  console.log('\n🔍 Validating Pricing Consistency...\n');

  const pricesByShapeAndCarat = new Map<string, Map<string, number[]>>();

  (shopifyProductsDetailed as any[]).forEach(product => {
    product.variants?.forEach((variant: any) => {
      const shapeOption = variant.selectedOptions?.find((opt: any) =>
        opt.name === 'Shape' || opt.name === 'Diamond Shape'
      )?.value;

      const caratOption = variant.selectedOptions?.find((opt: any) =>
        opt.name === 'Carat' || opt.name === 'Weight'
      )?.value;

      const price = typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price;

      if (shapeOption && caratOption && price > 0) {
        if (!pricesByShapeAndCarat.has(shapeOption)) {
          pricesByShapeAndCarat.set(shapeOption, new Map());
        }
        const shapeMap = pricesByShapeAndCarat.get(shapeOption)!;
        if (!shapeMap.has(caratOption)) {
          shapeMap.set(caratOption, []);
        }
        shapeMap.get(caratOption)!.push(price);
      }
    });
  });

  // Check for anomalies
  pricesByShapeAndCarat.forEach((caratMap, shape) => {
    const carats = Array.from(caratMap.keys()).sort();
    const prices = carats.map(c => {
      const ps = caratMap.get(c)!;
      return ps.reduce((a, b) => a + b, 0) / ps.length; // Average price
    });

    // Check if prices increase with carat (should be true)
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] <= prices[i - 1]) {
        issues.push({
          severity: 'critical',
          product: `${shape} variants`,
          productId: 'multiple',
          issue: 'Pricing does not scale with carat weight',
          currentValue: { [carats[i-1]]: prices[i-1], [carats[i]]: prices[i] },
          suggestedFix: 'Verify pricing structure - larger carats should cost more'
        });
      }
    }
  });
}

function validateMetafields() {
  console.log('\n🔍 Validating Metafields...\n');

  let emptyMetafieldCount = 0;

  (shopifyProductsDetailed as any[]).forEach(product => {
    const metafields = product.metafields || {};
    const emptyFields: string[] = [];

    ['jewelry_type', 'ring_design', 'ring_size', 'metal', 'diamond_type'].forEach(field => {
      if (!metafields[field] || metafields[field] === '' || metafields[field] === null) {
        emptyFields.push(field);
      }
    });

    if (emptyFields.length > 0) {
      emptyMetafieldCount++;
      issues.push({
        severity: 'warning',
        product: product.title,
        productId: product.id,
        issue: 'Empty metafields detected',
        currentValue: emptyFields,
        suggestedFix: 'Populate metafields in Shopify Admin or CSV'
      });
    }
  });

  console.log(`   Found ${emptyMetafieldCount} products with empty metafields\n`);
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 VALIDATION REPORT');
  console.log('='.repeat(80) + '\n');

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');

  console.log(`🚨 Critical Issues: ${criticalIssues.length}`);
  console.log(`⚠️  Warnings: ${warningIssues.length}`);
  console.log(`ℹ️  Total Products Scanned: ${(shopifyProductsDetailed as any[]).length}\n`);

  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (Must Fix):\n');
    criticalIssues.slice(0, 10).forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.product} (${issue.productId})`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Current: ${JSON.stringify(issue.currentValue)}`);
      if (issue.suggestedFix) {
        console.log(`   Fix: ${issue.suggestedFix}`);
      }
      console.log('');
    });
    if (criticalIssues.length > 10) {
      console.log(`   ... and ${criticalIssues.length - 10} more critical issues\n`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Next Steps:\n');
  console.log('1. Review critical issues and update product data in Shopify');
  console.log('2. Re-export products using scripts/fetch-shopify-products.ts');
  console.log('3. Run this validator again to confirm fixes');
  console.log('4. Frontend normalization will handle remaining edge cases');
  console.log('='.repeat(80) + '\n');
}

// Run all validations
validateMetalColorConsistency();
validateDiamondTypeValues();
validateVariantImageMatches();
validatePricingConsistency();
validateMetafields();
generateReport();
