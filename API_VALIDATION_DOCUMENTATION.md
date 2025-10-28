# Flixify Backend - User Registration Validation Documentation

## Overview
This document outlines the comprehensive input validation implemented for user registration and authentication endpoints in the Flixify Backend API.

## Validation Features Implemented

### 1. Email Validation
- **Format**: Valid email format using regex pattern and express-validator
- **Length**: Maximum 100 characters
- **Sanitization**: Automatic trimming and normalization
- **Pattern**: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

### 2. Password Strength Validation
- **Minimum Length**: 8 characters
- **Maximum Length**: 128 characters
- **Required Characters**:
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (@$!%*?&)
- **Restrictions**:
  - No more than 2 consecutive identical characters
  - No common patterns (123, abc, qwe, password, admin, etc.)

### 3. Username Validation
- **Length**: 3-30 characters
- **Characters**: Only alphanumeric characters and underscores
- **Pattern**: `^[a-zA-Z0-9_]+$`
- **Restrictions**: Cannot start or end with underscore

### 4. Full Name Validation
- **Length**: 2-50 characters
- **Characters**: Only letters and spaces
- **Pattern**: `^[a-zA-Z\s]+$`

### 5. Input Sanitization
- **HTML Tags**: Removes `<` and `>` characters
- **Whitespace**: Trims leading and trailing spaces
- **Email**: Normalizes email format

## API Endpoints with Validation

### 1. User Registration
**Endpoint**: `POST /api/v1/users/register`

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "password": "SecurePass123!",
  "avatar": "file",
  "coverImage": "file (optional)"
}
```

**Validation Rules**:
- All fields are required
- Email must be valid format
- Password must meet strength requirements
- Username must be 3-30 characters, alphanumeric + underscores only
- Full name must be 2-50 characters, letters and spaces only

**Error Responses**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must contain at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)",
      "value": "weakpass"
    }
  ]
}
```

### 2. User Login
**Endpoint**: `POST /api/v1/users/login`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "password": "SecurePass123!"
}
```

**Validation Rules**:
- Either email or username is required (not both)
- Password is required
- Email format validation if provided
- Username format validation if provided

### 3. Password Change
**Endpoint**: `POST /api/v1/users/change-password`

**Request Body**:
```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Validation Rules**:
- Both old and new passwords are required
- New password must meet strength requirements
- New password must be different from old password

### 4. Account Details Update
**Endpoint**: `PATCH /api/v1/users/update-account`

**Request Body**:
```json
{
  "fullName": "John Smith",
  "email": "john.smith@example.com"
}
```

**Validation Rules**:
- At least one field is required
- Email must be valid format if provided
- Full name must meet format requirements if provided
- Email uniqueness check (cannot be used by another user)

## Error Response Format

All validation errors follow this consistent format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": [
    {
      "field": "fieldName",
      "message": "Specific error message",
      "value": "Invalid value provided"
    }
  ]
}
```

## Security Features

### 1. Input Sanitization
- Removes potentially dangerous characters
- Trims whitespace
- Normalizes email addresses

### 2. Password Security
- Strong password requirements
- Prevention of common weak patterns
- Length restrictions to prevent DoS attacks

### 3. SQL Injection Prevention
- Input sanitization
- Parameterized queries (MongoDB)
- No direct string concatenation in queries

### 4. XSS Prevention
- HTML tag removal
- Input sanitization
- Proper output encoding

## Testing Validation

### Valid Registration Example
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe123",
    "password": "SecurePass123!"
  }'
```

### Invalid Registration Example
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "J",
    "email": "invalid-email",
    "username": "_invalid_",
    "password": "weak"
  }'
```

## Implementation Details

### Middleware Stack
1. **Multer**: File upload handling
2. **Validation Middleware**: Input validation and sanitization
3. **Error Handling**: Validation error processing
4. **Controller**: Business logic

### Validation Libraries Used
- `express-validator`: Comprehensive validation and sanitization
- `validator`: Additional validation utilities
- Custom regex patterns for specific requirements

### Database Constraints
- Unique constraints on email and username
- Length limits enforced at application level
- Proper indexing for performance

## Maintenance Notes

### Adding New Validation Rules
1. Update validation middleware in `src/middleware/validation.middleware.js`
2. Add corresponding error messages
3. Update API documentation
4. Add test cases

### Modifying Password Requirements
1. Update password regex in validation middleware
2. Update error messages
3. Update documentation
4. Consider migration strategy for existing users

### Performance Considerations
- Validation runs before database operations
- Sanitization reduces storage requirements
- Proper indexing on validated fields
- Caching of validation results where appropriate

## Troubleshooting

### Common Issues
1. **Email validation failing**: Check email format and length
2. **Password validation failing**: Ensure all requirements are met
3. **Username validation failing**: Check character restrictions
4. **Sanitization issues**: Verify input cleaning logic

### Debug Mode
Enable detailed validation logging by setting `NODE_ENV=development` in environment variables.

## Future Enhancements

### Planned Features
1. Rate limiting for registration attempts
2. Email verification before account activation
3. Password history to prevent reuse
4. Account lockout after failed attempts
5. Two-factor authentication support

### Security Improvements
1. CAPTCHA integration
2. IP-based rate limiting
3. Device fingerprinting
4. Advanced threat detection
