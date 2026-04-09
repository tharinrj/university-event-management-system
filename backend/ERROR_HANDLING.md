# Global API Error Handling Implementation

## Overview

Global API error handling has been implemented using Spring's `@RestControllerAdvice` annotation. This centralized error handling mechanism provides consistent error response formatting across the entire API.

## Architecture

### Components

#### 1. **Custom Exception Classes**
Located in `com.unievents.backend.exception`:

- **`ResourceNotFoundException`**: Thrown when a requested resource is not found (404)
- **`EventValidationException`**: Thrown when validation errors occur during event creation/update (400)

#### 2. **Error Response DTO**
Located in `com.unievents.backend.exception.dto`:

- **`ErrorResponse`**: Standard error response format with nested `FieldError` for validation errors
  ```
  {
    "status": 404,
    "message": "Event not found",
    "error": "Resource Not Found",
    "timestamp": "2026-03-24T20:56:57",
    "path": "/api/events/123",
    "fieldErrors": null
  }
  ```

#### 3. **Global Exception Handler**
Located in `com.unievents.backend.exception.handler`:

- **`GlobalExceptionHandler`**: Centralized handler for all exceptions with `@RestControllerAdvice`

## Error Handling Features

### Handled Exception Types

| Exception | HTTP Status | Handler |
|-----------|------------|---------|
| `ResourceNotFoundException` | 404 Not Found | Handles missing resources |
| `EventValidationException` | 400 Bad Request | Handles validation failures |
| `MethodArgumentNotValidException` | 400 Bad Request | Handles @Valid annotation failures |
| `ResponseStatusException` | Various | Handles Spring's default exceptions |
| `IllegalArgumentException` | 400 Bad Request | Handles invalid arguments |
| `Exception` (Global) | 500 Internal Server Error | Catches all unhandled exceptions |

### Response Format

All error responses follow a consistent format:

```json
{
  "status": 400,
  "message": "Validation failed for one or more fields",
  "error": "Validation Error",
  "timestamp": "2026-03-24T20:59:14",
  "path": "/api/events",
  "fieldErrors": [
    {
      "field": "title",
      "message": "Title is required",
      "rejectedValue": ""
    }
  ]
}
```

## Usage Examples

### 1. Resource Not Found
When requesting a non-existent event:
```bash
curl -X GET http://localhost:8080/api/events/nonexistent
```

Response:
```json
{
  "status": 404,
  "message": "Event not found",
  "error": "Resource Not Found",
  "timestamp": "2026-03-24T21:00:00",
  "path": "/api/events/nonexistent",
  "fieldErrors": null
}
```

### 2. Validation Error
When creating an event with missing required fields:
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{"category": "WORKSHOP"}'
```

Response:
```json
{
  "status": 400,
  "message": "Validation failed for one or more fields",
  "error": "Validation Error",
  "timestamp": "2026-03-24T21:00:00",
  "path": "/api/events",
  "fieldErrors": [
    {
      "field": "title",
      "message": "Title is required",
      "rejectedValue": null
    },
    {
      "field": "date",
      "message": "Date is required",
      "rejectedValue": null
    }
  ]
}
```

### 3. Update Non-existent Event
```bash
curl -X PUT http://localhost:8080/api/events/nonexistent \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Response: 404 with ResourceNotFoundException

## Integration Points

### Controller Integration
The controllers no longer need explicit try-catch blocks for common errors:

**Before:**
```java
throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
```

**After:**
```java
throw new ResourceNotFoundException("Event not found");
```

### Service Integration
Services throw custom exceptions:
```java
public Event updateEvent(String id, Event event) {
    if (!eventRepository.existsById(id)) {
        throw new ResourceNotFoundException("Event not found");
    }
    // ...
}
```

## Benefits

1. **Consistency**: All errors follow the same response format
2. **Maintainability**: Single place to modify error handling logic
3. **Cleaner Code**: Controllers and services don't need explicit error handling
4. **Better Debugging**: Includes timestamp, path, and detailed field errors
5. **Extensibility**: Easy to add new exception handlers

## Adding New Exception Handlers

To add a new exception handler:

1. Create a custom exception class in `com.unievents.backend.exception`
2. Add an `@ExceptionHandler` method in `GlobalExceptionHandler`

Example:
```java
@ExceptionHandler(CustomException.class)
public ResponseEntity<ErrorResponse> handleCustomException(
        CustomException ex,
        HttpServletRequest request
) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            "Custom Error",
            LocalDateTime.now(),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
}
```

## Testing

The error handling can be tested using:
- Unit tests for specific exception scenarios
- Integration tests using MockMvc
- Manual API testing with curl/Postman

All existing tests pass successfully with the new error handling implementation.

