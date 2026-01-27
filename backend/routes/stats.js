/**
 * Stats / info routes.
 * GET /api/stats — aggregate counts for projects.
 */

const express = require('express');
const { getProjectCount, getProjectCountByStatus } = require('../data/projects');

const router = express.Router();

/**
 * GET /api/stats
 * Returns project counts: total and by status.
 * Useful for dashboard or debugging.
 */
router.get('/', (req, res, next) => {
  try {
    const total = getProjectCount();
    const byStatus = getProjectCountByStatus();
    res.json({
      projects: {
        total,
        byStatus,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
