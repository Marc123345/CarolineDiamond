// src/utils/metafieldHelpers.ts

export const isMetaobjectReference = (value: string): boolean => {
  if (!value) return false;
  return value.includes('gid://shopify/Metaobject/');
};

export const parseMetafieldValue = (value: string): string => {
  if (!value) return '';

  try {
    const parsed = JSON.parse(value);

    // Handle Lists (e.g. ["Gold", "Silver"])
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) return '';

      // Check if it's a list of Metaobject IDs
      if (typeof parsed[0] === 'string' && isMetaobjectReference(parsed[0])) {
        return ''; // Return empty for now as we can't display raw IDs
      }

      // Join simple strings
      return parsed.filter(item => !isMetaobjectReference(item)).join(', ');
    }

    // Handle single strings that might be JSON stringified
    if (typeof parsed === 'string') {
      if (isMetaobjectReference(parsed)) return '';
      return parsed;
    }

    return String(parsed);
  } catch {
    // If JSON parse fails, it's likely a simple string
    if (isMetaobjectReference(value)) return '';
    return value;
  }
};

export const getMetafieldDisplay = (
  value: string | undefined,
  fallback: string = ''
): string => {
  if (!value) return fallback;

  const parsed = parseMetafieldValue(value);
  return parsed || fallback;
};

export const formatMetafieldList = (
  value: string,
  separator: string = ';',
  maxItems?: number
): string => {
  if (!value) return '';

  // Clean up and split string-based lists
  const items = value.split(separator).map(item => item.trim()).filter(Boolean);

  if (maxItems && items.length > maxItems) {
    return items.slice(0, maxItems).join(', ') + '...';
  }

  return items.join(', ');
};