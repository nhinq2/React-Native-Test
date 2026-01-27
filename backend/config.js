/**
 * Application configuration.
 * Uses environment variables with sensible defaults.
 */

const PORT = Number(process.env.PORT) || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

const VALID_PROJECT_STATUSES = ['draft', 'active', 'completed'];

const workspaceServiceConfig = {
  baseDomain: 'assessment-config.up.railway.app',
  apiVersion: 'api',
};

function getChartService() {
  const { baseDomain, apiVersion } = workspaceServiceConfig;
  return `https://${baseDomain}/${apiVersion}`;
}

const config = {
  port: PORT,
  nodeEnv: NODE_ENV,
  isDevelopment,
  validProjectStatuses: VALID_PROJECT_STATUSES,
  defaultProjectStatus: 'draft',
  workspaceServiceConfig,
  getChartService,
};

module.exports = config;
