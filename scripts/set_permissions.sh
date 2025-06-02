#!/bin/bash
# ────────────────────────────────────────────────────
# Purpose: BeforeInstall 훅에서 deploy_folders.sh에 실행권한(+x)을 부여
# CodeDeploy가 리비전을 /tmp/codedeploy_deployment/** 로 복사한 뒤 실행됨
# ────────────────────────────────────────────────────

chmod +x /tmp/codedeploy_deployment/scripts/deploy_folders.sh
