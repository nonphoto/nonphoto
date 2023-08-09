import { defineCliConfig } from "sanity/cli";
import config from "../sanity.config";

export default defineCliConfig({
  api: config,
});
