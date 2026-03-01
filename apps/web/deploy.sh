#!/bin/bash

# ===============================
# CONFIGURATION
# ===============================
BUCKET_NAME="my-frontend-bucket"      # Replace with your bucket name
BUILD_DIR="build"                      # Folder containing your final build
REGION="us-east-1"                     # AWS region of your bucket

# ===============================
# DEPLOYMENT
# ===============================

echo "Starting deployment to S3 bucket: $BUCKET_NAME"

# Sync local build folder to S3
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --region $REGION \
    --delete \
    --acl public-read \
    --cache-control "max-age=31536000"  # optional: cache long-lived assets

# Optional: force index.html to not be cached
aws s3 cp $BUILD_DIR/index.html s3://$BUCKET_NAME/index.html \
    --region $REGION \
    --acl public-read \
    --cache-control "no-cache, no-store, must-revalidate"

echo "Deployment completed!"
echo "Your site should be live at: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"