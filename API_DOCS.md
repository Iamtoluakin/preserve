# API Documentation

Complete reference for all API endpoints in the Preserve platform.

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
```

---

## Authentication

All protected endpoints require a valid Supabase session. The session is automatically managed by the `AuthProvider` context.

---

## 🔐 Authentication Endpoints

### Sign Up

**POST** `/api/auth/signup`

Create a new user account and organization.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "bank_admin",
  "organizationName": "First National Bank",
  "organizationType": "bank"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "bank_admin",
    "organizationId": "uuid"
  }
}
```

---

### Sign In

**POST** `/api/auth/login`

Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "bank_admin",
    "organization": {
      "id": "uuid",
      "name": "First National Bank",
      "type": "bank"
    }
  },
  "session": { /* Supabase session object */ }
}
```

---

### Sign Out

**POST** `/api/auth/logout`

Sign out the current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Check Session

**GET** `/api/auth/session`

Get current user session.

**Response:**
```json
{
  "success": true,
  "user": { /* User object */ },
  "session": { /* Session object */ }
}
```

---

## 🏠 Properties Endpoints

### List Properties

**GET** `/api/properties?organizationId={uuid}`

Get all properties for an organization.

**Query Parameters:**
- `organizationId` (required): Organization UUID

**Response:**
```json
{
  "success": true,
  "properties": [
    {
      "id": "uuid",
      "address": "123 Main St",
      "city": "Charlotte",
      "county": "Mecklenburg",
      "state": "NC",
      "zip": "28202",
      "propertyType": "single_family",
      "status": "active",
      "bankReference": "REO-123456",
      "notes": "Vacant property",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### Create Property

**POST** `/api/properties`

Create a new property.

**Request Body:**
```json
{
  "organizationId": "uuid",
  "userId": "uuid",
  "address": "123 Main St",
  "city": "Charlotte",
  "county": "Mecklenburg",
  "state": "NC",
  "zip": "28202",
  "propertyType": "single_family",
  "parcelId": "123-456-789",
  "acquisitionDate": "2025-01-01",
  "bankReference": "REO-123456",
  "notes": "Vacant property"
}
```

**Response:**
```json
{
  "success": true,
  "property": { /* Property object */ }
}
```

---

### Get Property

**GET** `/api/properties/{id}`

Get a single property by ID.

**Response:**
```json
{
  "success": true,
  "property": {
    /* Property object with work orders */
    "workOrders": [{ /* Array of work orders */ }]
  }
}
```

---

### Update Property

**PATCH** `/api/properties/{id}`

Update a property.

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "property": { /* Updated property */ }
}
```

---

### Delete Property

**DELETE** `/api/properties/{id}`

Delete a property.

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

## 📋 Work Orders Endpoints

### List Work Orders

**GET** `/api/work-orders?organizationId={uuid}&status={status}`

Get all work orders for an organization.

**Query Parameters:**
- `organizationId` (required): Organization UUID
- `status` (optional): Filter by status (new, accepted, in_progress, completed)

**Response:**
```json
{
  "success": true,
  "workOrders": [
    {
      "id": "uuid",
      "woNumber": "WO-2025-0001",
      "propertyId": "uuid",
      "priority": "high",
      "status": "new",
      "scheduledDate": "2025-01-20",
      "description": "Lawn maintenance needed",
      "totalCost": 150.00,
      "billingFrequency": "monthly",
      "property": { /* Property object */ },
      "services": [{ /* Array of services */ }],
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### Create Work Order

**POST** `/api/work-orders`

Create a new work order.

**Request Body:**
```json
{
  "organizationId": "uuid",
  "userId": "uuid",
  "propertyId": "uuid",
  "priority": "high",
  "scheduledDate": "2025-01-20",
  "description": "Lawn maintenance and debris removal",
  "accessInstructions": "Key in lockbox, code 1234",
  "billingFrequency": "monthly",
  "services": [
    {
      "serviceId": "uuid",
      "quantity": 1,
      "billingFrequency": "monthly"
    },
    {
      "serviceId": "uuid",
      "quantity": 2,
      "billingFrequency": "one-time"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "workOrder": { /* Work order object */ }
}
```

---

### Get Work Order

**GET** `/api/work-orders/{id}`

Get a single work order by ID.

**Response:**
```json
{
  "success": true,
  "workOrder": {
    /* Work order with property, services, and progress updates */
    "property": { /* Property object */ },
    "services": [{ /* Service objects */ }],
    "progressUpdates": [{ /* Update objects */ }]
  }
}
```

---

### Update Work Order

**PATCH** `/api/work-orders/{id}`

Update a work order.

**Request Body:**
```json
{
  "status": "in_progress",
  "assignedTo": "vendor-org-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "workOrder": { /* Updated work order */ }
}
```

---

### Delete Work Order

**DELETE** `/api/work-orders/{id}`

Delete a work order.

**Response:**
```json
{
  "success": true,
  "message": "Work order deleted successfully"
}
```

---

## 📊 Progress Updates Endpoints

### List Progress Updates

**GET** `/api/progress-updates?workOrderId={uuid}`

Get all progress updates for a work order.

**Query Parameters:**
- `workOrderId` (required): Work order UUID

**Response:**
```json
{
  "success": true,
  "updates": [
    {
      "id": "uuid",
      "workOrderId": "uuid",
      "status": "in_progress",
      "notes": "Started lawn maintenance",
      "percentComplete": 50,
      "estimatedCompletion": "2025-01-21",
      "createdBy": "uuid",
      "createdAt": "2025-01-20T10:00:00Z"
    }
  ]
}
```

---

### Create Progress Update

**POST** `/api/progress-updates`

Add a progress update to a work order.

**Request Body:**
```json
{
  "workOrderId": "uuid",
  "userId": "uuid",
  "status": "in_progress",
  "notes": "Completed lawn mowing, starting debris removal",
  "percentComplete": 50,
  "estimatedCompletion": "2025-01-21"
}
```

**Response:**
```json
{
  "success": true,
  "update": { /* Progress update object */ }
}
```

---

## 🛠️ Services Endpoints

### List Services

**GET** `/api/services?category={category}`

Get all available services.

**Query Parameters:**
- `category` (optional): Filter by category (lawn_care, maintenance, security, utilities, etc.)

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "id": "uuid",
      "name": "Lawn Mowing",
      "description": "Regular lawn mowing and edging",
      "category": "lawn_care",
      "basePrice": 75.00,
      "unit": "per service",
      "active": true
    }
  ]
}
```

---

## 📝 Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔑 Using the API in React

### Example: Fetching Properties

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

function PropertiesList() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(
          `/api/properties?organizationId=${user?.organization?.id}`
        );
        const data = await res.json();
        
        if (data.success) {
          setProperties(data.properties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.organization?.id) {
      fetchProperties();
    }
  }, [user]);

  // Render properties...
}
```

---

### Example: Creating a Work Order

```tsx
import { useAuth } from '@/contexts/AuthContext';

async function createWorkOrder(formData) {
  const { user } = useAuth();

  const response = await fetch('/api/work-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      organizationId: user.organization.id,
      userId: user.id,
      ...formData,
    }),
  });

  const data = await response.json();

  if (data.success) {
    // Handle success
    console.log('Work order created:', data.workOrder);
  } else {
    // Handle error
    console.error('Error:', data.error);
  }
}
```

---

## 🔒 Security Notes

1. All API routes validate authentication via Supabase session
2. Row Level Security (RLS) policies enforce data isolation
3. Users can only access data from their organization
4. Sensitive operations require proper role permissions
5. Always validate user input on the server side

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: Phase 1 Implementation
