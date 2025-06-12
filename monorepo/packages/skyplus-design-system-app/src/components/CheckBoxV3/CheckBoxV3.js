import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from '../../functions/sanitizeHtml';

const CheckBoxV3 = (props) => {
  const {
    containerClass,
    descClass,
    id,
    name,
    value,
    title,
    image,
    checked,
    description,
    onChangeHandler,
    // register = () => {},
    required,
    editable = true,
  } = props;
  const descriptionHtml = sanitizeHtml(description);
  if (!onChangeHandler) {
    return '';
  }

  const handleCheckboxChange = (e) => {
    editable && onChangeHandler(e.target.checked);
  };

  const handleSpanClick = () => {
    editable && onChangeHandler(!checked);
  };

  return (
    <div
      className={`skyplus-checkbox-v3 d-flex gap-4 align-items-start justify-content-left ${containerClass}`}
    >
      <div className="pt-2">

        <div className="pt-2">
          <input
            type="checkbox"
            name={name}
            id={id}
            value={value}
            checked={checked}
            required={required}
            onChange={handleCheckboxChange}
            className="d-none"
            aria-hidden="true"
          />

          <span
            role="checkbox"
            aria-checked={checked}
            aria-label={description || ''}
            id={`${id}-label`}
            tabIndex={0}
            className="cursor"
            onClick={handleSpanClick}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleSpanClick();
              }
            }}
          >
            {checked ? (
              editable ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M16.34 1.99988C19.73 1.99988 22 4.37988 22 7.91988V16.0909C22 19.6199 19.73 21.9999 16.34 21.9999H7.67C4.28 21.9999 2 19.6199 2 16.0909V7.91988C2 4.37988 4.28 1.99988 7.67 1.99988H16.34ZM16.18 8.99988C15.84 8.65988 15.28 8.65988 14.94 8.99988L10.81 13.1299L9.06 11.3799C8.72 11.0399 8.16 11.0399 7.82 11.3799C7.48 11.7199 7.48 12.2699 7.82 12.6199L10.2 14.9899C10.37 15.1599 10.59 15.2399 10.81 15.2399C11.04 15.2399 11.26 15.1599 11.43 14.9899L16.18 10.2399C16.52 9.89988 16.52 9.34988 16.18 8.99988Z"
                    fill="#24409A"
                  />
                </svg>
              )
                : (
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.34 2.49988C19.73 2.49988 22 4.87988 22 8.41988V16.5909C22 20.1199 19.73 22.4999 16.34 22.4999H7.67C4.28 22.4999 2 20.1199 2 16.5909V8.41988C2 4.87988 4.28 2.49988 7.67 2.49988H16.34ZM16.18 9.49988C15.84 9.15988 15.28 9.15988 14.94 9.49988L10.81 13.6299L9.06 11.8799C8.72 11.5399 8.16 11.5399 7.82 11.8799C7.48 12.2199 7.48 12.7699 7.82 13.1199L10.2 15.4899C10.37 15.6599 10.59 15.7399 10.81 15.7399C11.04 15.7399 11.26 15.6599 11.43 15.4899L16.18 10.7399C16.52 10.3999 16.52 9.84988 16.18 9.49988Z" fill="#9BA4B8" />
                  </svg>
                )
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63549 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z"
                  stroke="#24409A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </div>
      </div>
      <div>
        {title ? (
          <div className="d-flex align-items-center">
            {title}
            {image ? <img alt="whatsapp" src={image} /> : null}
          </div>
        ) : null}
        <div>
          {descriptionHtml ? (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
              id={`${id}-label`}
              className={descClass}
              htmlFor={id}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

CheckBoxV3.defaultProps = {
  checked: false,
  descClass: 'body-small-regular',
  required: false,
};

CheckBoxV3.propTypes = {
  containerClass: PropTypes.string,
  checked: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChangeHandler: PropTypes.func,
  description: PropTypes.string,
  descClass: PropTypes.string,
  required: PropTypes.bool,
  title: PropTypes.string,
  image: PropTypes.string,
  // register: PropTypes.any,
};

export default CheckBoxV3;
