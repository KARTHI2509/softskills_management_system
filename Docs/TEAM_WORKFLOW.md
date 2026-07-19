# Team Workflow Guide

This document outlines standard work procedures and guidelines for developers working on the **Smart Soft Skills Management System**.

## Branching Policy
We follow Git Flow structure for development:
- **`main`**: Production code. Must always be stable, building cleanly and deploying to production targets.
- **`dev`**: Integration branch for pre-releases. Team developers merge completed features here.
- **`feature/<name>`**: Local development branches for specific features or refactoring (e.g. `feature/jwt-auth`).

---

## Code Review Guidelines
- Open Pull Request (PR) from `feature/<name>` to `dev`.
- Ensure tests pass locally before pushing code.
- Reviewer checks code formatting against standard commenting guidelines.

---

## Commit Guidelines
Commit messages should follow standard prefixes to simplify Git history:
*   `feat: <message>` - Added a new user-facing functionality or component.
*   `fix: <message>` - Corrected a bug or runtime exception.
*   `docs: <message>` - Documentation additions or updates (e.g., changes to `Docs/` or READMEs).
*   `style: <message>` - Code styling updates, tailwind classes refactor (no logic change).
*   `refactor: <message>` - Code reorganization that does not alter features.
*   `chore: <message>` - Dependency package additions or project configurations changes.

### Commit Example
```bash
git commit -m "feat: implement student evaluation controller and routing tests"
```
