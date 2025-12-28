/*
  # Remove Unused and Abandoned Tables

  ## Overview
  This migration removes 19 database tables that are not being used by the application.
  These tables were created for features that were either abandoned or never implemented.

  ## Tables Being Removed

  ### 1. Abandoned Features (5 tables)
    - `diamond_selections` - Old diamond builder feature (0 rows)
    - `selection_products` - Related to old diamond builder (0 rows)
    - `paved_leads` - Unrelated business feature (0 rows)
    - `paved_estimator_requests` - Unrelated estimator tool (0 rows)
    - `magic_link_tokens` - Unused authentication method (0 rows)

  ### 2. Unused Metal Color Tracking (4 tables)
    - `metal_color_combinations` - Tracking code exists but never called (0 rows)
    - `metal_color_preferences` - Tracking code exists but never called (0 rows)
    - `metal_color_recommendations` - Recommendation system never implemented (0 rows)
    - `metal_color_education_views` - Education tracking never used (0 rows)

  ### 3. Unused Filter Features (4 tables)
    - `filter_presets` - User filter presets feature not implemented (0 rows)
    - `saved_searches` - Saved search feature not implemented (0 rows)
    - `product_filter_cache` - Alternative caching system not used (0 rows)
    - `filter_dependencies` - Hierarchical filter system not used (3 rows)

  ### 4. Unused Product Definition Tables (4 tables)
    - `stone_type_hierarchy` - Stone type definitions not referenced in code (7 rows)
    - `diamond_shape_definitions` - Shape definitions not referenced in code (7 rows)
    - `ring_type_definitions` - Ring type definitions not referenced in code (4 rows)
    - `filter_availability_rules` - Filter rules not used (4 rows)

  ## Tables Being Kept
  - All active tracking tables (filter_analytics, product_performance, etc.)
  - All product catalog tables (ring_models, pricing_tiers, metal_options, etc.)
  - All user/order/auth tables (core e-commerce functionality)
  - query_cache (has active code using it, just not populated yet)

  ## Safety Notes
  - All removed tables have 0 rows or very few rows with no code references
  - Foreign key constraints will be automatically dropped with CASCADE
  - This cleanup improves database maintainability and performance
*/

-- Drop abandoned feature tables
DROP TABLE IF EXISTS selection_products CASCADE;
DROP TABLE IF EXISTS diamond_selections CASCADE;
DROP TABLE IF EXISTS paved_leads CASCADE;
DROP TABLE IF EXISTS paved_estimator_requests CASCADE;
DROP TABLE IF EXISTS magic_link_tokens CASCADE;

-- Drop unused metal color tracking tables
DROP TABLE IF EXISTS metal_color_education_views CASCADE;
DROP TABLE IF EXISTS metal_color_recommendations CASCADE;
DROP TABLE IF EXISTS metal_color_preferences CASCADE;
DROP TABLE IF EXISTS metal_color_combinations CASCADE;

-- Drop unused filter feature tables
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS filter_presets CASCADE;
DROP TABLE IF EXISTS product_filter_cache CASCADE;
DROP TABLE IF EXISTS filter_dependencies CASCADE;

-- Drop unused product definition tables
DROP TABLE IF EXISTS filter_availability_rules CASCADE;
DROP TABLE IF EXISTS stone_type_hierarchy CASCADE;
DROP TABLE IF EXISTS diamond_shape_definitions CASCADE;
DROP TABLE IF EXISTS ring_type_definitions CASCADE;