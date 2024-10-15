export const validatePhoneFormat = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;  // Adjust based on your phone format
    return phoneRegex.test(phone);
}