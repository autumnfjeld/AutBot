# AutBot Versioning Strategy
(A bit of overkill for this toy project, but never hurts to be thorough. )

This project uses **independent versioning** for frontend and backend components.

## Frontend (React App)
- **Source of Truth**: `client/package.json` → `version` field
- **Display**: Automatically shown in app footer (imported from package.json)
- **Current**: v0.1.0

### Updating Frontend Version
```bash
cd client
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0
```
*The version is automatically imported from package.json - no manual config updates needed!*

## Backend (Python Server)
- **Source of Truth**: `server-python/__version__.py` → `__version__`
- **Display**: Available at `/api/version` endpoint
- **Current**: v0.1.0

### Updating Backend Version
1. Edit `server-python/__version__.py`
2. Update `__version__` and `CHANGELOG`
3. Optionally create Git tag: `git tag -a backend-v0.2.0 -m "Description"`

## Git Tagging Convention
- Frontend releases: `frontend-v0.1.0`
- Backend releases: `backend-v0.1.0`
- Full releases: `v0.1.0` (when both are released together)

## Semantic Versioning
Both components follow [SemVer](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Version Endpoints
- Frontend: Displayed in UI footer (auto-imported from package.json)
- Backend: `GET /api/version` returns version and changelog
- Test: `GET /api/test` includes version in response 