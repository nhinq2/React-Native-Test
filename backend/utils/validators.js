/**
 * Validation helpers for request body and query params.
 */

const { validProjectStatuses } = require('../config');

function isValidStatus(value) {
  return value != null && validProjectStatuses.includes(value);
}

function validateNonEmptyString(value, fieldName = 'field') {
  if (value === undefined || value === null) {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  if (value.trim().length === 0) {
    return { valid: false, error: `${fieldName} cannot be empty` };
  }
  return { valid: true, value: value.trim() };
}

function validateProjectCreate(body) {
  const errors = [];
  const nameResult = validateNonEmptyString(body.name, 'name');
  if (!nameResult.valid) errors.push(nameResult.error);

  const descResult = validateNonEmptyString(body.description, 'description');
  if (!descResult.valid) errors.push(descResult.error);

  const status = body.status ?? 'draft';
  if (!isValidStatus(status)) {
    errors.push(`status must be one of: ${validProjectStatuses.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      name: nameResult.value,
      description: descResult.value,
      status,
    } : null,
  };
}

function validateProjectUpdate(body) {
  const updates = {};
  const errors = [];

  if (body.name !== undefined) {
    const r = validateNonEmptyString(body.name, 'name');
    if (!r.valid) errors.push(r.error);
    else updates.name = r.value;
  }
  if (body.description !== undefined) {
    const r = validateNonEmptyString(body.description, 'description');
    if (!r.valid) errors.push(r.error);
    else updates.description = r.value;
  }
  if (body.status !== undefined) {
    if (!isValidStatus(body.status)) {
      errors.push(`status must be one of: ${validProjectStatuses.join(', ')}`);
    } else {
      updates.status = body.status;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? updates : null,
  };
}

function validateIdParam(id) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { valid: false, error: 'Invalid project id' };
  }
  return { valid: true, value: id.trim() };
}

module.exports = {
  isValidStatus,
  validateNonEmptyString,
  validateProjectCreate,
  validateProjectUpdate,
  validateIdParam,
};
