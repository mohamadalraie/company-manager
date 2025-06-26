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
  // تحويل المصفوفة إلى سلسلة نصية بصيغة JSON قبل التخزين
  // هذا يضمن أن بنية المصفوفة (بما في ذلك الأقواس والفواصل) يتم حفظها بشكل صحيح
  localStorage.setItem("userPermissions", JSON.stringify(permissions));
};

export const getPermissions = () => {
  // استرداد السلسلة النصية المخزنة من localStorage
  const permissionsString = localStorage.getItem("userPermissions");

  // التحقق مما إذا كانت هناك بيانات مخزنة
  if (!permissionsString) {
    // إذا لم تكن هناك بيانات، أرجع مصفوفة فارغة لتجنب الأخطاء
    return [];
  }

  // محاولة تحليل السلسلة النصية (JSON string) إلى مصفوفة JavaScript
  try {
    return JSON.parse(permissionsString);
  } catch (e) {
    // في حالة حدوث خطأ أثناء التحليل (مثلاً، إذا كانت البيانات تالفة أو ليست بصيغة JSON)
    console.error("Error parsing user permissions from localStorage:", e);
    // أرجع مصفوفة فارغة لتجنب الأعطال في التطبيق
    return [];
  }
};
export const removePermissions = () => {
  localStorage.removeItem("userPermissions");
};





export function  havePermission(permission){
  const permissions= getPermissions();
  return permissions.includes(permission);
}