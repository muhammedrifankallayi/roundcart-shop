# Token Refresh Implementation Guide

## Overview
Automatic token refresh mechanism has been implemented to handle expired tokens seamlessly across all API calls.

## How It Works

### 1. **Request Interceptor**
- Adds the stored access token to every API request header
- Automatically attaches `Authorization: Bearer {token}`

### 2. **Response Interceptor** (Main Logic)
When a 401 (Unauthorized) error occurs:

#### Step 1: Check if already refreshing
- If another request is already refreshing the token, queue the current request
- This prevents multiple simultaneous refresh attempts

#### Step 2: Attempt Token Refresh
- Gets the `refreshToken` from localStorage
- Calls `/auth/refresh` endpoint with the refresh token
- If no refresh token exists, clears auth data and redirects to login

#### Step 3: On Success
- Stores new access token in localStorage
- Updates axios default headers
- Retries the original failed request with new token
- Processes queued requests with new token

#### Step 4: On Failure
- Clears all auth data (token, refreshToken, user)
- Redirects to login page
- Rejects all queued requests

#### Step 5: After Completion
- Sets `isRefreshing = false` to allow new refresh cycles

## File Changes

### 1. `/src/data/axios/axiosInstance.ts`
**Changes:**
- Added queue management for multiple failed requests
- Implemented response interceptor with token refresh logic
- Added retry mechanism with `_retry` flag
- Proper error handling and localStorage cleanup

**Key Features:**
```typescript
- isRefreshing: Prevents multiple refresh attempts
- failedQueue: Stores requests while token is being refreshed
- processQueue(): Executes queued requests with new token
- Automatic localStorage cleanup on auth failure
- Redirect to login on refresh failure
```

### 2. `/src/data/services/auth.service.ts`
**Changes:**
- Renamed `ColorService` to `AuthService` (was incorrect name)
- Updated `refreshToken()` method signature
- Changed parameter from `token` to `refreshToken`
- Updated response type to include `refreshToken`
- Added `logout()` method

**Updated Methods:**
```typescript
refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>>
logout(): Promise<ApiResponse<null>>
```

### 3. `/src/components/AuthModal.tsx`
**Changes:**
- Updated import from `ColorService` to `AuthService`
- Updated method calls to use correct service name

## Usage Example

### Before (Manual Refresh)
```typescript
try {
  const response = await CartService.getCartasync();
  setCart(response.data);
} catch (error: any) {
  if (error.response?.status === 401) {
    // Manually refresh token
    const newToken = await AuthService.refreshToken(refreshToken);
    // Manually retry the request
    const response = await CartService.getCartasync();
    setCart(response.data);
  }
}
```

### After (Automatic Refresh)
```typescript
try {
  const response = await CartService.getCartasync();
  setCart(response.data);
} catch (error) {
  // Token refresh happens automatically in the interceptor!
  // If refresh succeeds: Request is automatically retried
  // If refresh fails: User is redirected to login
  toast({
    title: "Error",
    description: "Failed to fetch cart data.",
    variant: "destructive",
  });
}
```

## LocalStorage Keys Used

```typescript
localStorage.getItem('token')              // Access token (short-lived)
localStorage.getItem('refreshToken')       // Refresh token (long-lived)
localStorage.getItem('user')               // User data (optional)
```

## Error Scenarios Handled

1. **Token Expired (401 with token)**
   - Automatically refresh token
   - Retry the failed request
   - Update localStorage with new tokens

2. **No Refresh Token**
   - Clear all auth data
   - Redirect to login page

3. **Refresh Token Expired**
   - Clear all auth data
   - Redirect to login page

4. **Multiple Requests Failing**
   - Queue requests while refreshing
   - Execute all queued requests after successful refresh
   - Reject all if refresh fails

5. **Network Error During Refresh**
   - Clear auth data
   - Redirect to login
   - Reject queued requests

## Integration with All Services

No changes needed! All services using axios automatically benefit from this:

```typescript
// Cart Service
const cartResponse = await CartService.getCartasync();

// Address Service
const addresses = await AddressService.getListasync();

// Product Service
const products = await ItemService.getListasync();

// All automatically handle token refresh!
```

## Best Practices

1. **Always store refreshToken**
   ```typescript
   localStorage.setItem('token', response.token);
   localStorage.setItem('refreshToken', response.refreshToken);
   ```

2. **Handle refresh errors gracefully**
   - User will be automatically redirected to login
   - Show appropriate error messages if needed

3. **Test token expiration**
   - Set short token expiration in backend for testing
   - Verify requests are automatically retried

4. **Monitor token refresh**
   - Add logging if needed:
   ```typescript
   console.log('Token refreshed successfully');
   console.log('Request retried with new token');
   ```

## Testing

To test the token refresh mechanism:

1. Login to the application
2. Wait for token to expire (or manually update token in localStorage with expired one)
3. Make any API call (cart, products, etc.)
4. Verify:
   - Token refresh is triggered
   - New token is stored in localStorage
   - Original request is retried and succeeds

## Troubleshooting

### Issue: User keeps getting redirected to login
- Check if `refreshToken` is being saved properly
- Verify backend `/auth/refresh` endpoint is working
- Check token expiration times in backend

### Issue: Requests are failing immediately
- Ensure tokens are stored in localStorage
- Check browser dev tools > Storage > LocalStorage
- Verify API_BASE_URL is correct

### Issue: Multiple token refresh attempts
- This is normal - the queue prevents concurrent refreshes
- Check network tab to verify only one refresh request is made
