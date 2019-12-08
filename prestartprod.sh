echo "[STEP 1 of 2] Creating meta directory /tmp/gcp_billing_b_end"
mkdir -p /tmp/gcp_billing_b_end

echo "[STEP 2 of 2] Creating gcp credential file /tmp/gcp_billing_b_end/account.json"
echo "$GCLOUD_BILLING_DASHBOARD_TOKEN" | base64 -d > /tmp/gcp_billing_b_end/account.json