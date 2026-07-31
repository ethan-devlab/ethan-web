# Security Policy

## Scope

This repository builds a static portfolio site. It has no user accounts, server-side application API, or contact-form backend. Security review covers the published static assets, client-side routing, the trusted MDX content pipeline, the CI workflow, and deployment configuration.

## Supported Version

Only the current `main` branch and its deployed build are supported.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately through the contact channel published on the portfolio. Include the affected URL or file, a concise reproduction, potential impact, and any suggested mitigation. Do not publicly disclose the issue until the owner has had a reasonable opportunity to investigate and deploy a fix.

## Content and Deployment Boundaries

- Blog MDX is trusted, repository-reviewed source content; it must not accept untrusted runtime input or arbitrary third-party scripts.
- Production secrets and analytics IDs must stay out of the repository. The analytics integration is optional and enabled only by deployment configuration.
- Deployment changes must preserve the response security headers in `public/_headers` and the least-privilege CI permissions in `.github/workflows/ci.yml`.
