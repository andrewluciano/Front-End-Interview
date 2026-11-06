GCP_PROJECT ?= stage-faturaviva-app
GCP_REGION ?= us-central1
GCP_SERVICE ?= faturaviva-stage-web
IMAGE ?= gcr.io/$(GCP_PROJECT)/$(GCP_SERVICE)
ALLOW_UNAUTH ?= --allow-unauthenticated
ENV_VARS ?= FATURAVIVA_API_BASE_URL=https://faturaviva-api-stage-672622411438.us-central1.run.app,JWT_SECRET=change-me23e
BUILD_ENV_VARS ?= NPM_CONFIG_PRODUCTION=false,GOOGLE_NODE_RUN_SCRIPTS=gcp-build,GOOGLE_PACKAGE_MANAGER=npm

.PHONY: docker-build docker-run docker-build-local deploy-cloudrun

ifneq ($(strip $(ENV_VARS)),)
SET_ENV_VARS := --set-env-vars $(ENV_VARS)
else ifneq ($(strip $(FATURAVIVA_API_BASE_URL)),)
SET_ENV_VARS := --set-env-vars FATURAVIVA_API_BASE_URL=$(FATURAVIVA_API_BASE_URL)
else
SET_ENV_VARS :=
endif

docker-build:
	docker build -t $(IMAGE) .

docker-build-local:
	docker build -t $(GCP_SERVICE):local .

docker-run:
	docker run --rm -p 8080:8080 -e PORT=8080 $(GCP_SERVICE):local

deploy-cloudrun:
	@test -n "$(GCP_PROJECT)" || (echo "GCP_PROJECT is required (ex: make deploy-cloudrun GCP_PROJECT=your-project-id)"; exit 1)
	gcloud builds submit \
		--project $(GCP_PROJECT) \
		--tag $(IMAGE) \
		--quiet \
		.
	gcloud run deploy $(GCP_SERVICE) \
		--project $(GCP_PROJECT) \
		--region $(GCP_REGION) \
		--image $(IMAGE) \
		--platform managed \
		--allow-unauthenticated \
		$(if $(BUILD_ENV_VARS),--set-build-env-vars $(BUILD_ENV_VARS),) \
		$(if $(ENV_VARS),--set-env-vars $(ENV_VARS),) \
		--quiet
