import { createElement } from 'react';
import { sanitize } from 'dompurify';

const HtmlBlock = (args) => {
  const { tagName = 'div', html, ...props } = args;
  return (
    <>
      {createElement(tagName, {
        ...props,
        dangerouslySetInnerHTML: { __html: sanitize ? sanitize(html) : html },
      })}
    </>
  );
};

export default HtmlBlock;
