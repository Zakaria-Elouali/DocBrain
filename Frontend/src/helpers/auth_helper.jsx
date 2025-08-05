// auth/permissions.js
import { useCallback } from 'react';

// Define role constants
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  VIEWER: "VIEWER",
  CLIENT: "CLIENT",
};

// Define permission constants for better type safety and maintainability
export const PERMISSIONS = {
  APPOINTMENT: {
    DELETE: "APPOINTMENT_DELETE",
    CREATE: "APPOINTMENT_CREATE",
    VIEW: "APPOINTMENT_VIEW",
    EDIT: "APPOINTMENT_EDIT",
  },
  ROLE: {
    DELETE: "ROLE_DELETE",
    CREATE: "ROLE_CREATE",
    VIEW: "ROLE_VIEW",
    EDIT: "ROLE_EDIT",
  },
  DOCUMENT: {
    VIEW: "DOCUMENT_VIEW",
  },
  USER: {
    CREATE: "USER_CREATE",
  },
};

// Get user information from sessionStorage with error handling
const getUserFromStorage = () => {
  try {
    return JSON.parse(sessionStorage.getItem("authUser"));
  } catch (error) {
    console.error("Error parsing user from sessionStorage:", error);
    return null;
  }
};

// Custom hook for authorization
export const useAuth = () => {
  const user = getUserFromStorage();
  const userRoles = user?.roles || [];
  const userPermissions = user?.permissions || [];

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return userRoles.includes(role);
  }, [userRoles]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    // Super admin has all permissions
    if (hasRole(ROLES.SUPER_ADMIN)) return true;

    return userPermissions.includes(permission);
  }, [userPermissions]);

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback((permissions) => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback((permissions) => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  return {
    user,
    userRoles,
    userPermissions,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAuthenticated: !!user,
    isAdmin: hasRole(ROLES.ADMIN),
    isSuperAdmin: hasRole(ROLES.SUPER_ADMIN),
    isViewer: hasRole(ROLES.VIEWER),
    isClient: hasRole(ROLES.CLIENT),
  };
};

// HOC for protecting routes/components based on permissions
export const withPermission = (WrappedComponent, requiredPermission) => {
  return function PermissionWrapper(props) {
    const { hasPermission } = useAuth();

    if (!hasPermission(requiredPermission)) {
      return null; // Or return an unauthorized component
    }

    return <WrappedComponent {...props} />;
  };
};

// Component for conditional rendering based on permissions
export const PermissionGate = ({ children, permission, fallback = null }) => {
  const { hasPermission } = useAuth();

  return hasPermission(permission) ? children : fallback;
};


// HERE JUST TO SHOW HOW TO USE IT IN A COMPONENT BY WRAPPING IT
// <PermissionGate permission={PERMISSIONS.DOCUMENT.VIEW}>
//   <DocumentViewer />
// </PermissionGate>


// HERE ALSO HOW TO USE IT IN A COMPONENT BY  EXPORTING IT WITH PERMISSION
// const ExampleComponent = () => {
//   // Component logic
// };
// export default withPermission(ExampleComponent, PERMISSIONS.USER.CREATE);


// here the code  making the user role and permission automatically extract from authUser
//
// // auth/dynamicPermissions.js
// import { useCallback } from 'react';
//
// // Function to generate permission Mainarea from array
// export const generatePermissionStructure = (permissionsArray) => {
//   const Mainarea = {};
//
//   permissionsArray.forEach(permission => {
//     // Split permission string into parts (e.g., "APPOINTMENT_DELETE" -> ["APPOINTMENT", "DELETE"])
//     const [resource, action] = permission.split('_');
//
//     // Create resource object if it doesn't exist
//     if (!Mainarea[resource]) {
//       Mainarea[resource] = {};
//     }
//
//     // Add action to resource
//     Mainarea[resource][action] = permission;
//   });
//
//   return Mainarea;
// };
//
// // Function to generate roles object
// export const generateRoles = (rolesArray) => {
//   return rolesArray.reduce((acc, role) => {
//     acc[role] = role;
//     return acc;
//   }, {});
// };
//
// // Custom hook for using dynamic permissions and roles
// export const useAuth = () => {
//   const user = JSON.parse(sessionStorage.getItem("authUser"));
//   const userRoles = user?.roles || [];
//   const userPermissions = user?.permissions || [];
//
//   // Dynamically generate structures
//   const PERMISSIONS = generatePermissionStructure(userPermissions);
//   const ROLES = generateRoles(userRoles);
//
//   // Check if user has specific role
//   const hasRole = useCallback((role) => {
//     return userRoles.includes(role);
//   }, [userRoles]);
//
//   // Check if user has specific permission
//   const hasPermission = useCallback((permission) => {
//     // Super admin has all permissions
//     if (userRoles.includes('SUPER_ADMIN')) return true;
//
//     return userPermissions.includes(permission);
//   }, [userRoles, userPermissions]);
//
//   // Check if user has any of the specified permissions
//   const hasAnyPermission = useCallback((permissions) => {
//     return permissions.some(permission => hasPermission(permission));
//   }, [hasPermission]);
//
//   return {
//     user,
//     ROLES,
//     PERMISSIONS,
//     userRoles,
//     userPermissions,
//     hasRole,
//     hasPermission,
//     hasAnyPermission,
//     isAuthenticated: !!user
//   };
// };
//
// // Example of how to use in components/routes
// export const PermissionGate = ({ children, permission, fallback = null }) => {
//   const { hasPermission, PERMISSIONS } = useAuth();
//
//   // Handle both string and object notation
//   const requiredPermission = typeof permission === 'string'
//       ? permission
//       : PERMISSIONS[permission.resource]?.[permission.action];
//
//   return hasPermission(requiredPermission) ? children : fallback;
// };