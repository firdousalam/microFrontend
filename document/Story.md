🏗️ PROJECT NAME

Micro Frontend Commerce Platform

Modules:

Auth (Identity Product)

Dashboard (Analytics Product)

Product (Catalog Product)

Sales (Transaction Product)

Shell (Container Platform)

🔵 EPIC 1 — Monorepo Foundation
🟢 Story 1: Setup Turborepo Monorepo

Goal: Create a production-grade monorepo structure using Turborepo and Next.js.

Tasks:

Initialize turborepo

Create apps folder

Create packages folder

Setup TypeScript base config

Setup shared ESLint config

Setup shared prettier config

Configure turbo.json pipeline

Acceptance Criteria:

npm run dev runs without error

Turborepo caches builds

Folder structure matches enterprise standard

🟢 Story 2: Create Base Applications

Goal: Create 5 independent Next.js apps inside monorepo.

Apps:

shell

auth

dashboard

product

sales

Tasks:

Generate Next.js app for each module

Enable App Router

Enable TypeScript

Add basic homepage in each

Set different local ports

Acceptance Criteria:

Each app runs independently

Each app builds successfully

No shared dependency errors

🔵 EPIC 2 — Shell as Platform
🟢 Story 3: Implement Shell Layout

Goal: Create a global layout system.

Tasks:

Add sidebar navigation

Add header

Add route links:

/auth

/dashboard

/product

/sales

Add loading state component

Acceptance Criteria:

Shell shows navigation

Links work

Layout is reusable

🟢 Story 4: Implement Local Reverse Proxy

Goal: Shell proxies other apps during development.

Tasks:

Add rewrites in next.config.js

Proxy:

/auth → localhost:3001

/dashboard → localhost:3002

/product → localhost:3003

/sales → localhost:3004

Test routing

Acceptance Criteria:

Visiting /auth loads auth app

All modules accessible via shell

🔵 EPIC 3 — Auth is a Product
🟢 Story 5: Build Auth UI

Goal: Create login and register pages.

Tasks:

Create login page

Create register page

Create form validation

Create reusable input component

Create button component

Acceptance Criteria:

Form validates

UI is reusable

No hardcoded credentials

🟢 Story 6: Implement JWT Authentication

Goal: Implement secure auth system.

Tasks:

Create API route for login

Create JWT token generator

Store token in httpOnly cookie

Create /me endpoint

Create logout endpoint

Acceptance Criteria:

Login returns JWT

Cookie stored securely

/me returns user info

Logout clears cookie

🟢 Story 7: Create Auth SDK

Goal: Allow other apps to use auth safely.

Tasks:

Create packages/auth-sdk

Implement login()

Implement getUser()

Implement logout()

Export typed interfaces

Acceptance Criteria:

Dashboard can import auth-sdk

No direct API calls in dashboard

Auth remains independent

🔵 EPIC 4 — Protected Routing
🟢 Story 8: Add Middleware Protection

Goal: Only authenticated users access dashboard/product/sales.

Tasks:

Create middleware in each app

Validate token

Redirect to /auth/login if missing

Handle expired token

Acceptance Criteria:

Unauthorized users redirected

Authorized users access content

No infinite redirect loops

🔵 EPIC 5 — Product Module
🟢 Story 9: Implement Product CRUD UI

Goal: Build product catalog UI.

Tasks:

Product list page

Add product form

Edit product form

Delete product

Create reusable table component

Acceptance Criteria:

Products can be added

Products persist (mock DB initially)

UI components reusable

🟢 Story 10: Add Backend API Layer

Goal: Separate UI from logic.

Tasks:

Create API routes

Create service layer

Implement in-memory database

Add validation

Acceptance Criteria:

UI calls service layer

Business logic separated

Ready to plug real DB later

🔵 EPIC 6 — Sales Module
🟢 Story 11: Build Sales Management

Goal: Track orders and transactions.

Tasks:

Sales list page

Create order page

Order status update

Calculate totals

Generate invoice view

Acceptance Criteria:

Orders stored

Total calculated correctly

Sales isolated from product logic

🔵 EPIC 7 — Dashboard Module
🟢 Story 12: Implement Analytics Dashboard

Goal: Show summary stats.

Tasks:

Total products card

Total sales card

Revenue calculation

Add chart component

Fetch from product and sales APIs

Acceptance Criteria:

Dashboard fetches data

No direct DB access

Uses service APIs only

🔵 EPIC 8 — Shared UI Library
🟢 Story 13: Create Shared UI Package

Goal: Avoid duplication.

Tasks:

Create packages/ui

Add Button

Add Input

Add Modal

Add Table

Add Card

Acceptance Criteria:

All apps use shared components

No duplicate UI logic

Version controlled

🔵 EPIC 9 — Dockerization
🟢 Story 14: Dockerize Each Module

Goal: Each product containerized.

Tasks:

Create Dockerfile per app

Multi-stage build

Test locally

Expose correct ports

Acceptance Criteria:

Each app runs in container

Images optimized

No environment variable issues

🔵 EPIC 10 — CI/CD
🟢 Story 15: Setup GitHub Actions

Goal: Automate build & deployment.

Tasks:

Create workflow per app

Add path-based trigger

Add lint step

Add test step

Add build step

Add docker push step

Acceptance Criteria:

Changing product only builds product

CI passes

Docker image created

🔵 EPIC 11 — Kubernetes
🟢 Story 16: Create Kubernetes Deployments

Goal: Deploy independently.

Tasks:

Create deployment.yaml per app

Create service.yaml per app

Create ingress.yaml

Test on Minikube

Acceptance Criteria:

Each module scalable

Ingress routes correctly

Pods restart automatically

🔵 FINAL EPIC — Production Hardening
🟢 Story 17: Add Logging & Error Handling

Central error boundary

Structured logging

API error format

🟢 Story 18: Add Role-Based Access (RBAC)

Admin role

Sales role

Product role

Route protection by role

🧠 How To Use This in Kiro

Instead of pasting everything at once:

Paste story by story.

Example prompt to Kiro:

Generate a Turborepo monorepo structure with 5 Next.js apps (shell, auth, dashboard, product, sales) using TypeScript and App Router. Follow enterprise folder structure and enable independent ports.

Then move to next story.

🏆 What This Gives You

If you complete all stories:

You will have built:

Enterprise-grade micro-frontend

Domain-driven architecture

Independent deployments

Real CI/CD

Kubernetes scalable system

This is senior-level architecture.



📄 PRODUCT REQUIREMENT DOCUMENT (PRD)
🏢 Project Name

Commerce Micro-Frontend Platform

1️⃣ Executive Summary

The Commerce Micro-Frontend Platform is a modular web application built using Next.js and domain-driven micro-frontend architecture.

The system consists of five independent frontend products:

Auth (Identity & Access)

Dashboard (Analytics & Overview)

Product (Catalog Management)

Sales (Order & Revenue Management)

Shell (Container Platform)

Each product must:

Be independently deployable

Be independently testable

Have its own CI/CD pipeline

Scale independently

Integrate through well-defined APIs

2️⃣ Product Vision

Build a scalable, enterprise-ready micro-frontend system that mimics real-world architecture used by companies like:

Amazon

Spotify

The goal is to simulate domain-driven product ownership.

3️⃣ Architecture Overview
System Architecture Type

Micro-Frontend

Domain-Driven Design (DDD)

Monorepo for development

Independent deployment for production

Core Technology Stack

Next.js (App Router)

TypeScript

Turborepo

Docker

Kubernetes

GitHub Actions

JWT Authentication

4️⃣ Product Modules Definition
🔐 Module 1: Auth Product
Purpose

Manages identity, authentication, and access control.

Features

Login

Register

Logout

JWT token issuing

Refresh token

/me endpoint

Role-based access control (Admin, Sales, Product)

Non-Functional Requirements

Secure httpOnly cookies

Middleware validation

Token expiration handling

No direct DB access from other modules

Ownership

Auth is an independent product with its own CI/CD and deployment.

📊 Module 2: Dashboard Product
Purpose

Provides business analytics and overview metrics.

Features

Total products

Total sales

Revenue summary

Chart visualization

Role-based data access

Data Sources

Product API

Sales API

Auth SDK

Restrictions

Cannot directly access database

Must use APIs only

📦 Module 3: Product Product
Purpose

Manage product catalog.

Features

Product listing

Create product

Update product

Delete product

Product validation

Business Rules

Product must have name, price, category

Price must be positive

Only Admin/Product role can modify

💰 Module 4: Sales Product
Purpose

Manage transactions and orders.

Features

Create order

Update order status

Calculate totals

Invoice generation

Sales history

Business Rules

Order must link to product

Revenue auto-calculated

Only Sales/Admin role allowed

🏠 Module 5: Shell Platform
Purpose

Acts as container and integration layer.

Responsibilities

Global navigation

Route proxying

Layout system

Feature flags

Environment configuration

Shell must remain lightweight.

5️⃣ Functional Requirements
FR-1

Each module must run independently on different ports locally.

FR-2

Shell must proxy all modules locally.

FR-3

Auth must protect Dashboard, Product, and Sales routes.

FR-4

Each module must have its own Docker image.

FR-5

Each module must have independent GitHub Actions workflow.

6️⃣ Non-Functional Requirements

Must support horizontal scaling

Must support independent deployment

Must support future migration to separate repositories

Must maintain loose coupling

Must avoid shared global state

7️⃣ Deployment Requirements

Each module must include:

Dockerfile (multi-stage build)

Kubernetes Deployment

Kubernetes Service

Ingress configuration

System must run in:

Local dev (ports)

Docker Compose

Minikube

8️⃣ CI/CD Requirements

Each module must:

Trigger CI only when its folder changes

Run lint

Run unit tests

Build app

Build Docker image

Push image

Deploy to Kubernetes

9️⃣ Security Requirements

JWT with expiration

httpOnly cookies

Role-based middleware

No sensitive logic in frontend

No cross-module direct state sharing

🔟 Testing Requirements

Each module must include:

Unit tests

Integration tests

E2E tests from shell

Minimum test coverage target: 70%

1️⃣1️⃣ Scalability Roadmap

Phase 1:

Monorepo + local development

Phase 2:

Dockerized services

Phase 3:

Kubernetes deployment

Phase 4:

Separate repositories

Phase 5:

Module Federation dynamic loading

1️⃣2️⃣ Risks
Risk	Mitigation
Tight coupling	Use SDK abstraction
Shared state conflicts	Avoid global stores
Deployment complexity	Automate CI/CD
Auth token leakage	Use httpOnly cookies
1️⃣3️⃣ Success Metrics

Each module deploys independently

Each module scales independently

Local development works seamlessly

CI/CD works per module

No direct cross-module dependency

🧠 How You Use This with Kiro

Instead of vague prompts, you now give Kiro structured tasks like:

Generate the Auth module based on this PRD. Include JWT authentication, middleware protection, and API routes. Follow micro-frontend architecture with independent Dockerfile.

Then move module by module.

🚀 What This Makes You

After building this:

You won’t be “React developer”.

You’ll be:

Micro-frontend architect

Domain-driven designer

DevOps-aware engineer

Enterprise system designer