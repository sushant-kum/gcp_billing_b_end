echo "[STEP 1 of 2] Creating meta directory ./.meta"
mkdir -p ./.meta

echo "[STEP 2 of 2] Creating gcp credential file ./.meta/account.json"
echo "$GCLOUD_BILLING_DASHBOARD_TOKEN" | base64 -d > ./.meta/account.json