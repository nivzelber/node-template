import { logger } from "./logger";

logger.transports.forEach(transport => {
  logger.remove(transport);
});
