// eslint-disable-next-line import/no-extraneous-dependencies
import { sanitize } from 'dompurify';

// Create a custom configuration for DOMPurify
const customConfig = {
  ALLOWED_ATTR: ['target', 'href', 'title', 'id', 'class'],
};

const sanitizeHtml = (html) => {
  return sanitize ? sanitize(html, customConfig) : html;
};

export default sanitizeHtml;
