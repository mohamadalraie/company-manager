// token
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};
export const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  return token;
};
export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

//role
export const setRole = (role) => {
  localStorage.setItem("userRole", role);
};
export const getRole = () => {
  const role = localStorage.getItem("userRole");
  return role;
};
export const removeRole = () => {
  localStorage.removeItem("userRole");
};

//permissions
export const setPermissions = (permissions) => {
  localStorage.setItem("userPermissions", permissions);
};
export const getPermissions = () => {
  const permissions = localStorage.getItem("userPermissions");
  return permissions;
};
export const removePermissions = () => {
  localStorage.removeItem("userPermissions");
};
