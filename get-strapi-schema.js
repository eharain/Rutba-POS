// get-strapi-schema.js
const fs = require("fs");
const path = require("path");

const STRAPI_SRC_DIR = path.join(__dirname,"pos-strapi", "src", "api"); // Change if needed
const outputFile = path.join(__dirname, "combined-schema.json");

function readSchemas(dir) {
  const combined = {};

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(1);
  }

  const apis = fs.readdirSync(dir);
  apis.forEach((apiName) => {
    const contentTypesDir = path.join(dir, apiName, "content-types");

    if (!fs.existsSync(contentTypesDir)) return;

    const contentTypes = fs.readdirSync(contentTypesDir);
    contentTypes.forEach((ctName) => {
      const schemaPath = path.join(contentTypesDir, ctName, "schema.json");

      if (fs.existsSync(schemaPath)) {
        try {
          const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
          combined[`${apiName}.${ctName}`] = schema;
        } catch (err) {
          console.error(`Error reading schema: ${schemaPath}`, err);
        }
      }
    });
  });

  return combined;
}

function main() {
  const allSchemas = readSchemas(STRAPI_SRC_DIR);
  fs.writeFileSync(outputFile, JSON.stringify(allSchemas, null, 2), "utf8");
  console.log(`✅ Combined schema written to ${outputFile}`);
}

main();
