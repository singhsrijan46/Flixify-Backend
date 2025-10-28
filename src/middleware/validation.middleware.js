import { body, validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Username validation regex (alphanumeric and underscores only)
const usernameRegex = /^[a-zA-Z0-9_]+$/;

// Password strength validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Sanitization function
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

// Validation rules for user registration
export const validateUserRegistration = [
    // Full name validation
    body('fullName')
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .customSanitizer(sanitizeInput)
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),

    // Email validation
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email must not exceed 100 characters')
        .customSanitizer(sanitizeInput)
        .normalizeEmail(),

    // Username validation
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .customSanitizer(sanitizeInput)
        .matches(usernameRegex)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom((value) => {
            if (value.startsWith('_') || value.endsWith('_')) {
                throw new Error('Username cannot start or end with underscore');
            }
            return true;
        }),

    // Password validation
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(passwordRegex)
        .withMessage('Password must contain at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)')
        .custom((value) => {
            // Additional password strength checks
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            const hasSpecialChar = /[@$!%*?&]/.test(value);
            const hasConsecutiveChars = /(.)\1{2,}/.test(value);
            const hasCommonPatterns = /(123|abc|qwe|password|admin)/i.test(value);

            if (!hasUpperCase) {
                throw new Error('Password must contain at least one uppercase letter');
            }
            if (!hasLowerCase) {
                throw new Error('Password must contain at least one lowercase letter');
            }
            if (!hasNumbers) {
                throw new Error('Password must contain at least one number');
            }
            if (!hasSpecialChar) {
                throw new Error('Password must contain at least one special character (@$!%*?&)');
            }
            if (hasConsecutiveChars) {
                throw new Error('Password cannot contain more than 2 consecutive identical characters');
            }
            if (hasCommonPatterns) {
                throw new Error('Password cannot contain common patterns like "123", "abc", "password", etc.');
            }
            return true;
        })
];

// Validation rules for user login
export const validateUserLogin = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .customSanitizer(sanitizeInput)
        .normalizeEmail(),
    
    body('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .customSanitizer(sanitizeInput)
        .matches(usernameRegex)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1 })
        .withMessage('Password cannot be empty')
];

// Validation rules for password change
export const validatePasswordChange = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Old password is required'),

    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('New password must be between 8 and 128 characters')
        .matches(passwordRegex)
        .withMessage('New password must contain at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)')
        .custom((value) => {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            const hasSpecialChar = /[@$!%*?&]/.test(value);
            const hasConsecutiveChars = /(.)\1{2,}/.test(value);
            const hasCommonPatterns = /(123|abc|qwe|password|admin)/i.test(value);

            if (!hasUpperCase) {
                throw new Error('New password must contain at least one uppercase letter');
            }
            if (!hasLowerCase) {
                throw new Error('New password must contain at least one lowercase letter');
            }
            if (!hasNumbers) {
                throw new Error('New password must contain at least one number');
            }
            if (!hasSpecialChar) {
                throw new Error('New password must contain at least one special character (@$!%*?&)');
            }
            if (hasConsecutiveChars) {
                throw new Error('New password cannot contain more than 2 consecutive identical characters');
            }
            if (hasCommonPatterns) {
                throw new Error('New password cannot contain common patterns like "123", "abc", "password", etc.');
            }
            return true;
        })
];

// Validation rules for account details update
export const validateAccountUpdate = [
    body('fullName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .customSanitizer(sanitizeInput)
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email must not exceed 100 characters')
        .customSanitizer(sanitizeInput)
        .normalizeEmail()
];

// Middleware to handle validation results
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));
        
        throw new ApiError(400, 'Validation failed', errorMessages);
    }
    
    next();
};

// Custom validation for login (either email or username required)
export const validateLoginFields = (req, res, next) => {
    const { email, username } = req.body;
    
    if (!email && !username) {
        throw new ApiError(400, 'Either email or username is required');
    }
    
    next();
};
