#!/usr/bin/env node
import { readFileSync } from "node:fs";

const [jsonPath, jsOrigin, redirectUri, clientResource, token] = process.argv.slice(2);
const client = JSON.parse(readFileSync(jsonPath, "utf8"));

const allowedOrigins = new Set(client.allowedOrigins ?? []);
const redirectUris = new Set(client.redirectUris ?? []);

allowedOrigins.add(jsOrigin);
redirectUris.add(redirectUri);

const patchBody = {
  allowedOrigins: [...allowedOrigins],
  redirectUris: [...redirectUris],
};

const response = await fetch(
  `https://iam.googleapis.com/v1/${clientResource}?updateMask=allowedOrigins,redirectUris`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchBody),
  },
);

const text = await response.text();
if (!response.ok) {
  console.error(`Patch failed (${response.status}): ${text}`);
  process.exit(1);
}

console.log("OAuth client updated.");
console.log(`- JavaScript origins include: ${jsOrigin}`);
console.log(`- Redirect URIs include: ${redirectUri}`);
