#!/bin/bash
cd "$(dirname "$0")/../pos-desk"
npm install
forever start -c "npm run dev" .