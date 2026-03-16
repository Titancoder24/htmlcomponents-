/**
 * @module validate-color
 * @description Validates CSS color strings against hex, HSL, and RGB formats.
 * Ensures user-provided color overrides are syntactically valid before
 * injecting them into compiled output. Supports 3/4/6/8-digit hex,
 * modern and legacy HSL/HSLA, and modern and legacy RGB/RGBA notations.
 */

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const RGB_PATTERN =
  /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*([,/]\s*(0|1|0?\.\d+|\d{1,3}%))?\s*\)$/;

const HSL_PATTERN =
  /^hsla?\(\s*(\d{1,3})(deg|rad|turn)?\s*[,\s]\s*(\d{1,3})%\s*[,\s]\s*(\d{1,3})%\s*([,/]\s*(0|1|0?\.\d+|\d{1,3}%))?\s*\)$/;

/**
 * Validates whether a string is a valid hex, RGB, or HSL color value.
 */
export function validateColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }

  const trimmed = color.trim();

  if (HEX_PATTERN.test(trimmed)) {
    return true;
  }

  if (RGB_PATTERN.test(trimmed)) {
    return validateRgbRange(trimmed);
  }

  if (HSL_PATTERN.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Checks that RGB channel values are within 0-255.
 */
function validateRgbRange(rgb: string): boolean {
  const match = rgb.match(RGB_PATTERN);
  if (!match) {
    return false;
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  return r <= 255 && g <= 255 && b <= 255;
}
