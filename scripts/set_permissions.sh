#!/bin/bash
# ────────────────────────────────────────────────
# AfterInstall 훅에서 deploy_folders.sh에 실행 권한을 부여
# /tmp/codedeploy_deployment/scripts/deploy_folders.sh 경로가 존재함을 전제로 함
# ────────────────────────────────────────────────

chmod +x /tmp/codedeploy_deployment/scripts/deploy_folders.sh