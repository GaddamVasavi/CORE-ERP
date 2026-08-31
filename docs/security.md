# CoreERP Security Architecture & Compliance

## Authentication & Session Management
- **Stateless JWT**: Signed using HMAC-SHA256 with 24-hour expiration.
- **Silent Token Rotation**: High-entropy cryptographically secure refresh tokens stored with revocation status.
- **Password Hashing**: BCrypt with cost factor 10.
- **Account Lockout**: Automatic lock after 5 consecutive failed attempts.
- **Rate Limiting**: Sliding-window Redis token bucket enforcing 50 requests/second per IP.
