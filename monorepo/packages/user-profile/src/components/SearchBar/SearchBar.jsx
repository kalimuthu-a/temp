import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const SearchBar = ({
  aemData,
  handleSearch,
  iframeRef,
  isChatBotOpen,
  setIsChatBotOpen,
}) => {
  const [searchKey, setSearchKey] = useState('');

  const handleChange = (e) => {
    setSearchKey(e.target.value);
  };

  const botClass = isChatBotOpen ? 'chatbot-wrapper-open' : '';

  const handleTileClick = () => {
    const elements = document.querySelectorAll('.title-icon-card__card');
    elements.forEach((element) => {
      // eslint-disable-next-line
      element.style.cursor = 'pointer';
      element.addEventListener('click', () => {
        const childDiv = element.querySelector('.title-icon-card__card-title');
        if (childDiv) {
          const text = childDiv.textConten || childDiv.innerText;
          handleSearch(text);
        }
      });
    });
  };

  useEffect(() => {
    window.addEventListener('message', (e) => {
      const messageData = e.data;
      if (messageData === 'closed_window_here') {
        setIsChatBotOpen(false);
      }
    });
    handleTileClick();
    return () => {
      window.removeEventListener('message', () => {});
    };
  }, []);

  useEffect(() => {
    if (isChatBotOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isChatBotOpen]);

  return (
    <div className="contact-us-container">
      <div className="search-actions">
        <HtmlBlock html={aemData?.askAnythingDescription?.html} />
        <div className="search-box">
          <div className='prefix-search-icon'>
            <i class="icon-search icon-size-md"></i>
          </div>
          <input
            type="text"
            name="searchKey"
            value={searchKey}
            onChange={handleChange}
            placeholder={aemData?.startTypingSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchKey, true);
              }
            }}
          />
          <div
            className="suffix-icon open-cx-webform right d-flex justify-content-center align-items-center"
            onClick={() => handleSearch(searchKey, true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSearch(searchKey, true);
              }
            }}
            aria-label="Open search bar"
          >
            <i className="sky-icons icon-arrow-top-right sm" />
          </div>
        </div>
      </div>

      <div>
        <div className={botClass ? 'chatbot-overlay-open' : ''} />
        <iframe
          className={`chatbot-wrapper ${botClass}`}
          src={aemData?.chatIframeSrcLink}
          id="cxwf-iframe"
          title="chatIfram"
          ref={iframeRef}
          frameBorder="0"
        />
      </div>
    </div>
  );
};
SearchBar.propTypes = {
  aemData: PropTypes.object,
  handleSearch: PropTypes.func,
  iframeRef: PropTypes.object,
  isChatBotOpen: PropTypes.bool,
  setIsChatBotOpen: PropTypes.func,
};
export default SearchBar;
