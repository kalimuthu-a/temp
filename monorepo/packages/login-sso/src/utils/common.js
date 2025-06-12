export const maskString = (string = '') => {
  try {
    const size = string?.length;
    if (size <= 2) {
      return string;
    }
    const masked = string.substring(0, 1) + 'x'.repeat(size - 2) + string.substring(size - 1, size);
    return masked;
  } catch (err) {
    console.log('masking datadog error', err)
    return '';
  }
}

export const maskEmail = (string = '') => {
  try {
    const dividedArray = string?.split('@');
    if (dividedArray?.length < 1) {
      return;
    }
    return maskString(dividedArray?.[0])
  } catch (err) {
    console.log('masking datadog error', err)
    return '';
  }
}