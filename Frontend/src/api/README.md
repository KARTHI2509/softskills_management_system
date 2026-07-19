# Frontend API Client

## Purpose
Exposes standard Axios configurations and request/response interceptors.

## Files
- `axiosClient.js`: Custom Axios instance preloaded with JWT headers mapping automatically from localStorage.

## Responsibilities
- Intercept outbound requests to include authentication headers.
- Gracefully handle unauthorized (401) responses by routing users to Login.
