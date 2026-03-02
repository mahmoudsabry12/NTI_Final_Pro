# Logging in User & Product Modules

This document explains how **structured logging** is implemented in the **User** and **Product** modules using **Winston**.

---

## Logger Configuration

- Logger is defined in `config/logger.js`.
- Stores logs in **JSON format** with timestamps.
- Transports:
  - `error.log` → for `error` level messages
  - `combined.log` → for all messages (`info`, `warn`, `error`)
  - Console output in development mode

**Metadata added automatically:**

- `action` → identifies operation type (e.g., `USER_CREATE`, `PRODUCT_DELETE`)
- `userId` / `email` → identifies the user
- `route` / `method` / `ip` → request context
- `stack` → for errors

---

## User Module Logging

Implemented in `repositories/user.repository.js`:

| Method | Log Level | Metadata |
|--------|-----------|----------|
| `create(userData)` | info | action: `USER_CREATE`, userId, email |
|  | error | action: `USER_CREATE_ERROR`, email, error, stack |
| `findByEmail(email)` | info | action: `USER_FIND_BY_EMAIL`, email, userId, found |
|  | error | action: `USER_FIND_BY_EMAIL_ERROR`, email, error, stack |
| `findById(id)` | info | action: `USER_FIND_BY_ID`, userId, found |
|  | error | action: `USER_FIND_BY_ID_ERROR`, userId, error, stack |
| `updateById(id, updateData)` | info | action: `USER_UPDATE`, userId, updatedFields |
|  | error | action: `USER_UPDATE_ERROR`, userId, error, stack |
| `deleteById(id)` | info | action: `USER_DELETE`, userId, deleted |
|  | error | action: `USER_DELETE_ERROR`, userId, error, stack |
| `findAll()` | info | action: `USER_FIND_ALL`, total |
|  | error | action: `USER_FIND_ALL_ERROR`, error, stack |

**Example:**

```json id="example-user-log"
{
  "action": "USER_CREATE",
  "userId": "64f5a2c7e7d1f2b3a4c5d6e7",
  "email": "john@example.com",
  "level": "info",
  "message": "User created",
  "timestamp": "2026-03-02T10:00:00.000Z"
}