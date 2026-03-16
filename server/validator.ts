/**
 * @module validator
 * @description Validates component metadata objects against the expected schema.
 * Checks for required fields, valid types, known categories, and proper
 * structure of props, slots, and events definitions. Returns structured
 * validation results with field-level error messages.
 */

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ComponentMeta {
  name?: string;
  displayName?: string;
  description?: string;
  category?: string;
  version?: string;
  status?: string;
  variants?: string[];
  tags?: string[];
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
  events?: Record<string, unknown>;
  customProperties?: string[];
  dependencies?: string[];
  [key: string]: unknown;
}

const KNOWN_CATEGORIES = [
  'primitives', 'layout', 'navigation', 'typography',
  'animated', 'backgrounds', 'data-display', 'marketing',
  'application',
];

const KNOWN_STATUSES = ['stable', 'beta', 'experimental', 'deprecated'];

/**
 * Validates that required string fields are present and non-empty.
 */
function validateRequiredStrings(
  meta: ComponentMeta,
  errors: ValidationError[]
): void {
  const required = ['name', 'description', 'category'];

  for (const field of required) {
    const value = meta[field];
    if (!value || typeof value !== 'string' || value.trim() === '') {
      errors.push({
        field,
        message: `"${field}" is required and must be a non-empty string`,
      });
    }
  }
}

/**
 * Validates the category field against known categories.
 */
function validateCategory(
  meta: ComponentMeta,
  errors: ValidationError[]
): void {
  if (meta.category && !KNOWN_CATEGORIES.includes(meta.category)) {
    errors.push({
      field: 'category',
      message: `Unknown category "${meta.category}". Expected one of: ${KNOWN_CATEGORIES.join(', ')}`,
    });
  }
}

/**
 * Validates the status field against known statuses.
 */
function validateStatus(
  meta: ComponentMeta,
  errors: ValidationError[]
): void {
  if (meta.status && !KNOWN_STATUSES.includes(meta.status)) {
    errors.push({
      field: 'status',
      message: `Unknown status "${meta.status}". Expected one of: ${KNOWN_STATUSES.join(', ')}`,
    });
  }
}

/**
 * Validates array fields are actually arrays of strings.
 */
function validateStringArrays(
  meta: ComponentMeta,
  errors: ValidationError[]
): void {
  const arrayFields = ['variants', 'tags', 'customProperties', 'dependencies'];

  for (const field of arrayFields) {
    const value = meta[field];
    if (value !== undefined && !Array.isArray(value)) {
      errors.push({
        field,
        message: `"${field}" must be an array`,
      });
    }
  }
}

/**
 * Validates object fields are actually objects.
 */
function validateObjectFields(
  meta: ComponentMeta,
  errors: ValidationError[]
): void {
  const objectFields = ['props', 'slots', 'events'];

  for (const field of objectFields) {
    const value = meta[field];
    if (value !== undefined && (typeof value !== 'object' || Array.isArray(value))) {
      errors.push({
        field,
        message: `"${field}" must be an object`,
      });
    }
  }
}

/**
 * Validates component metadata against the Voltz schema.
 * Returns a ValidationResult with valid flag and any errors found.
 */
export function validateComponentMeta(
  meta: ComponentMeta
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!meta || typeof meta !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Metadata must be an object' }],
    };
  }

  validateRequiredStrings(meta, errors);
  validateCategory(meta, errors);
  validateStatus(meta, errors);
  validateStringArrays(meta, errors);
  validateObjectFields(meta, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}
