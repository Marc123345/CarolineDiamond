export const isMetaobjectReference = (value: string): boolean => {
  if (!value) return false;
  return value.includes('gid://shopify/Metaobject/');
};

export const parseMetafieldValue = (value: string): string => {
  if (!value) return '';

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) return '';

      if (typeof parsed[0] === 'string' && isMetaobjectReference(parsed[0])) {
        return '';
      }

      return parsed.filter(item => !isMetaobjectReference(item)).join(', ');
    }

    if (typeof parsed === 'string') {
      if (isMetaobjectReference(parsed)) return '';
      return parsed;
    }

    return String(parsed);
  } catch {
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

  const items = value.split(separator).map(item => item.trim()).filter(Boolean);

  if (maxItems && items.length > maxItems) {
    return items.slice(0, maxItems).join(', ') + '...';
  }

  return items.join(', ');
};
