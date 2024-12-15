#!/bin/bash

# Backup erstellen
cp -r .git .git.bak

# Sensible Daten ersetzen
git filter-repo --force \
    --replace-text <(cat << 'EOF'
SENDGRID_API_KEY=***REMOVED***==>SENDGRID_API_KEY=***REMOVED***
NEXT_PUBLIC_SANITY_PROJECT_ID=***REMOVED***=>NEXT_PUBLIC_SANITY_PROJECT_ID=***REMOVED***
SANITY_TOKEN=***REMOVED***=>SANITY_TOKEN=***REMOVED***
JWT_SECRET=***REMOVED***=>JWT_SECRET=***REMOVED***
NEXT_PUBLIC_BOTPRESS_TOKEN=***REMOVED***=>NEXT_PUBLIC_BOTPRESS_TOKEN=***REMOVED***
EOF
)
