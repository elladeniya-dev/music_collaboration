# HarmoniX Backend - Professional Spring Boot Architecture

## 📁 Project Structure

```
src/main/java/com/harmonix/
├── BackendApplication.java          # Main Spring Boot application class
│
├── config/                           # Configuration classes
│   ├── CloudinaryConfig.java        # Cloudinary bean configuration
│   ├── CorsConfig.java               # CORS settings
│   ├── JwtConfig.java                # JWT initialization
│   └── SecurityConfig.java           # Spring Security configuration
│
├── constant/                         # Application constants and enums
│   ├── AppConstants.java             # Application-wide constants
│   ├── UserType.java                 # User type enumeration
│   ├── MessageStatus.java            # Message status enumeration
│   └── CollaborationStatus.java      # Collaboration status enumeration
│
├── controller/                       # REST API endpoints
│   ├── AuthController.java           # Authentication endpoints
│   ├── UserController.java           # User management endpoints
│   ├── JobPostController.java        # Job post CRUD endpoints
│   ├── MessageController.java        # Messaging endpoints
│   ├── ChatHeadController.java       # Chat management endpoints
│   └── CollaborationRequestController.java
│
├── dto/                              # Data Transfer Objects
│   ├── request/                      # Request DTOs
│   │   ├── UserTypeUpdateRequest.java
│   │   ├── JobPostCreateRequest.java
│   │   ├── JobPostUpdateRequest.java
│   │   ├── MessageCreateRequest.java
│   │   └── CollaborationRequestCreateRequest.java
│   │
│   └── response/                     # Response DTOs
│       ├── ApiResponse.java          # Generic API response wrapper
│       ├── ErrorResponse.java        # Error response structure
│       ├── UserResponse.java
│       ├── JobPostResponse.java
│       ├── MessageResponse.java
│       └── CollaborationRequestResponse.java
│
├── entity/                           # MongoDB entities (formerly model)
│   ├── User.java                     # User entity with @Document
│   ├── JobPost.java                  # Job post entity
│   ├── Message.java                  # Message entity
│   ├── ChatHead.java                 # Chat head entity
│   └── CollaborationRequest.java     # Collaboration request entity
│
├── exception/                        # Custom exceptions
│   ├── GlobalExceptionHandler.java   # Centralized exception handling
│   ├── UnauthorizedException.java    # 401 exception
│   ├── ResourceNotFoundException.java # 404 exception
│   └── BadRequestException.java      # 400 exception
│
├── mapper/                           # Entity-DTO converters
│   ├── UserMapper.java               # User entity-DTO mapping
│   ├── JobPostMapper.java            # JobPost entity-DTO mapping
│   ├── MessageMapper.java            # Message entity-DTO mapping
│   └── CollaborationRequestMapper.java
│
├── repository/                       # MongoDB repositories
│   ├── UserRepository.java
│   ├── JobPostRepository.java
│   ├── MessageRepository.java
│   ├── ChatHeadRepository.java
│   └── CollaborationRequestRepository.java
│
├── security/                         # Security components
│   └── JwtAuthFilter.java            # JWT authentication filter
│
├── service/                          # Business logic layer
│   ├── CloudinaryService.java        # Image upload service
│   ├── JobPostService.java           # Job post business logic
│   ├── MessageService.java           # Message business logic
│   ├── ChatHeadService.java          # Chat management logic
│   └── CollaborationRequestService.java
│
└── util/                             # Utility classes
    ├── JwtUtil.java                  # JWT token utilities
    ├── AuthUtil.java                 # Authentication utilities
    └── CookieUtil.java               # Cookie management utilities
```

## 🎯 Professional Spring Boot Standards Applied

### ✅ Package Naming Conventions
- `entity` instead of `model` (domain objects)
- `dto` for data transfer objects
- `mapper` for entity-DTO conversions
- `constant` for constants and enums
- `util` for utility classes

### ✅ Best Practices Implemented
1. **Separation of Concerns**: Clear layer separation
2. **DTO Pattern**: Never expose entities directly
3. **Mapper Pattern**: Centralized conversion logic
4. **Global Exception Handling**: Consistent error responses
5. **Constants & Enums**: No magic strings/numbers
6. **Validation**: Jakarta Bean Validation
7. **Transaction Management**: `@Transactional` annotations
8. **Dependency Injection**: Constructor injection with Lombok
9. **Immutability**: Final fields where possible
10. **Logging**: SLF4J with proper log levels

## 🔐 Security Architecture

- JWT authentication with HTTP-only cookies
- `JwtAuthFilter` for token validation
- OAuth2 integration (Google)
- Centralized auth utilities in `util` package

## 📊 API Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "timestamp": "2026-01-04T14:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with email: 'test@example.com'",
  "path": "/api/users/test@example.com"
}
```

## 🚀 Running in IntelliJ IDEA

1. **Open Project**: File → Open → Select backend directory
2. **Wait for Dependencies**: Maven will auto-download dependencies
3. **Configure Environment**: Set up `.env` file with credentials
4. **Run Application**: 
   - Right-click `BackendApplication.java`
   - Select "Run 'BackendApplication'"
5. **Access**: http://localhost:8080

## 📝 Key Improvements

| Before | After |
|--------|-------|
| `model` package | `entity` package (standard naming) |
| Entities in responses | DTOs in responses |
| No validation | Jakarta Validation with `@Valid` |
| Try-catch everywhere | Global exception handler |
| Magic strings | Constants and enums |
| Security utils in security pkg | Utilities in `util` package |
| Inconsistent responses | Standardized `ApiResponse` wrapper |
| Field injection | Constructor injection |
| No transaction management | `@Transactional` annotations |

---

**Version**: 2.0.0 - Professional Spring Boot Structure  
**Last Updated**: January 4, 2026
