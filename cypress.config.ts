import { seedDatabase } from "./cypress/lib/seed";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "cypress";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  chromeWebSecurity: false,
  retries: 5,
  env: {
    ...process.env,
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        // Clear and Seed database with test data
        async "db:seed"() {
          await seedDatabase();

          return null;
        },
      });

      return config;
    },
  },
});
