# Get Next Release Action

[![GitHub Actions](https://github.com/NordicSemiconductor/cloud-get-next-version-action/workflows/Test%20and%20Release/badge.svg)](https://github.com/NordicSemiconductor/cloud-get-next-version-action/actions)
[![Known Vulnerabilities](https://snyk.io/test/github/NordicSemiconductor/cloud-get-next-version-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/NordicSemiconductor/cloud-get-next-version-action?targetFile=package.json)
[![Known Vulnerabilities](https://snyk.io/test/github/NordicSemiconductor/cloud-get-next-version-action/badge.svg?targetFile=Dockerfile)](https://snyk.io/test/github/NordicSemiconductor/cloud-get-next-version-action?targetFile=Dockerfile)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/NordicSemiconductor/cloud-get-next-version-action)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Determines the next release version for the current repository, using
[`@semantic-release/commit-analyzer`](https://github.com/semantic-release/commit-analyzer).

This is useful in cases where you need to know the version that is about to be
released, so it can be included as a version string in a build.

## Usage

```yaml
- uses: actions/checkout@v2
- name: Determine next release version
  uses: nordicsemiconductor/cloud-get-next-version-action@saga
  id: version
  with:
    branch: saga
    defaultVersion: "0.0.0-development"
```

`${{ steps.version.outputs.nextRelease }}` then contains the next release
version (or `0.0.0-development` if no new release would be created).

[Here](./.github/workflows/usage.yaml) is a minimal example.
