#!/usr/bin/env sh
set -eu

if [ "${1-}" = "" ]; then
  echo "Usage: ./scripts/init-template.sh <new-service-name>"
  exit 1
fi

NEW_SERVICE_NAME="$1"
OLD_SERVICE_NAME="azure-devops-service-starter"
OLD_DISPLAY_NAME="Azure DevOps Service Starter"

NEW_DISPLAY_NAME="$(printf '%s' "$NEW_SERVICE_NAME" | tr '-_' ' ' | awk '{
  for (i = 1; i <= NF; i++) {
    $i = toupper(substr($i, 1, 1)) tolower(substr($i, 2))
  }
  print
}')"

FILES="
package.json
package-lock.json
README.md
.env.example
template.config.json
docker-compose.yml
.github/workflows/ci-cd.yml
src/config/env.ts
src/routes/index.ts
src/server.ts
tests/app.test.ts
docs/ARCHITECTURE.md
docs/INCIDENT_SIMULATION.md
infra/README.md
infra/main.bicep
"

echo "Updating starter references for: $NEW_SERVICE_NAME"
echo "Derived display name: $NEW_DISPLAY_NAME"

for file in $FILES; do
  if [ -f "$file" ]; then
    perl -0pi.bak -e "s/\Q$OLD_SERVICE_NAME\E/$NEW_SERVICE_NAME/g; s/\Q$OLD_DISPLAY_NAME\E/$NEW_DISPLAY_NAME/g" "$file"
    echo "Updated $file (backup: $file.bak)"
  fi
done

echo
echo "Next steps:"
echo "1. Review the updated files and backup copies."
echo "2. Update any remaining organization-specific values such as image paths or Azure names."
echo "3. Run npm test && npm run build && npm run lint."
