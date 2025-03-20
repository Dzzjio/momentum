export const validateName = (value: string): { isValid: boolean; minLength: boolean; maxLength: boolean } => {
    const regex = /^[a-zA-Zა-ჰ]+$/;
    const minLength = value.length >= 2;
    const maxLength = value.length <= 255;
    const isValidFormat = regex.test(value);
    return {
      isValid: minLength && maxLength && isValidFormat,
      minLength: minLength && isValidFormat,
      maxLength: maxLength && isValidFormat,
    };
  };
  
  export const validateFile = (file: File | null): boolean => {
    if (!file) return false;
    const isImage = file.type.startsWith('image/');
    const isSizeValid = file.size <= 600 * 1024; // 600KB
    return isImage && isSizeValid;
  };
  
  export const validateAvatar = (file: File | null): boolean => {
    return !!file && validateFile(file);
  };
  
  export const validateDepartment = (value: string, departments: { id: number }[]): boolean => {
    if (!value) return false;
    const departmentId = Number(value);
    return departments.some((dept) => dept.id === departmentId);
  };