#!/bin/bash
set -e

# CodeDeploy 환경 변수 (CodeDeploy 에이전트가 자동으로 주입)
# DEPLOYMENT_GROUP_NAME: 배포 그룹 이름(예: "DeploymentGroupA" 또는 "DeploymentGroupB")

echo "===== CodeDeploy AfterInstall Hook 시작 ====="
echo "Deployment Group: ${DEPLOYMENT_GROUP_NAME}"

# 리비전 전체가 복사된 경로
SRC_ROOT="/tmp/codedeploy_deployment"

# EC2 A에는 folder1, EC2 B에는 folder2를 각각 복사할 예시 경로
TARGET_A="/home/ubuntu/targetA"
TARGET_B="/home/ubuntu/targetB"

# DeploymentGroup 이름에 따라 분기
if [[ "${DEPLOYMENT_GROUP_NAME}" == "junwoo-deployment-group1" ]]; then
  echo "[junwoo-deployment-group1] → folder1 코드를 EC2 A에 복사 시작"
  mkdir -p "${TARGET_A}"
  rm -rf "${TARGET_A:?}/"*
  cp -r "${SRC_ROOT}/folder1/"* "${TARGET_A}/"
  echo "folder1 → ${TARGET_A} 복사 완료."

elif [[ "${DEPLOYMENT_GROUP_NAME}" == "junwoo-deployment-group2" ]]; then
  echo "[junwoo-deployment-group2] → folder2 코드를 EC2 B에 복사 시작"
  mkdir -p "${TARGET_B}"
  rm -rf "${TARGET_B:?}/"*
  cp -r "${SRC_ROOT}/folder2/"* "${TARGET_B}/"
  echo "folder2 → ${TARGET_B} 복사 완료."

else
  echo "Error: 알 수 없는 배포 그룹: ${DEPLOYMENT_GROUP_NAME}"
  exit 1
fi

echo "===== CodeDeploy AfterInstall Hook 종료 ====="
