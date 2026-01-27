/**
 * Projects API routes.
 * GET /api/projects, GET /api/projects/:id, POST, PUT, DELETE.
 */

const express = require('express');
const {
  getProjectsByStatus,
  sortProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../data/projects');
const {
  validateProjectCreate,
  validateProjectUpdate,
  validateIdParam,
} = require('../utils/validators');
const { validProjectStatuses } = require('../config');

const router = express.Router();

/**
 * GET /api/projects
 * List all projects. Optional ?status=draft|active|completed, ?sort=updatedAt|createdAt|name, ?order=asc|desc.
 */
router.get('/', (req, res, next) => {
  try {
    const status = req.query.status;
    const sort = req.query.sort || 'updatedAt';
    const order = req.query.order || 'desc';
    let list = getProjectsByStatus(validProjectStatuses.includes(status) ? status : null);
    list = sortProjects(list, sort, order);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/projects/:id
 * Get a single project by ID.
 */
router.get('/:id', (req, res, next) => {
  try {
    const idResult = validateIdParam(req.params.id);
    if (!idResult.valid) {
      return res.status(400).json({ error: idResult.error });
    }
    const project = getProjectById(idResult.value);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/projects
 * Create a new project.
 * Body: { name: string, description: string, status?: draft|active|completed }
 */
router.post('/', (req, res, next) => {
  try {
    const validation = validateProjectCreate(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.errors[0] || 'Validation failed',
        errors: validation.errors,
      });
    }
    const project = createProject(validation.data);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/projects/:id
 * Update an existing project.
 * Body: { name?: string, description?: string, status?: draft|active|completed }
 */
router.put('/:id', (req, res, next) => {
  try {
    const idResult = validateIdParam(req.params.id);
    if (!idResult.valid) {
      return res.status(400).json({ error: idResult.error });
    }
    const validation = validateProjectUpdate(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.errors[0] || 'Validation failed',
        errors: validation.errors,
      });
    }
    if (Object.keys(validation.data).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    const project = updateProject(idResult.value, validation.data);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project.
 */
router.delete('/:id', (req, res, next) => {
  try {
    const idResult = validateIdParam(req.params.id);
    if (!idResult.valid) {
      return res.status(400).json({ error: idResult.error });
    }
    const deleted = deleteProject(idResult.value);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
