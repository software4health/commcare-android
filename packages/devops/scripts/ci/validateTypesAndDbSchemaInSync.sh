#!/bin/bash -ex

SCRIPT_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$SCRIPT_DIR"

cd ../../../..
echo "Connected to postgres server: $DB_URL, starting to setup database"
yarn workspace @tupaia/database setup-test-database

# Run check
yarn workspace @tupaia/types assert-no-changes