import { any } from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import RedirectTo from '../../utils/redirect';

const BookAgain = ({ bookAgain }) => {
  return (
    <div className="bookAgain--wrapper">
      <div>
        <h4>{ bookAgain?.title }</h4>
        <HtmlBlock
          tagName="p"
          className="small"
          html={bookAgain?.description?.html?.slice(3)}
        />
      </div>
      <button
        type="button"
        onClick={() => RedirectTo(bookAgain?.path)}
        aria-label="book again hyperlink"
        tabIndex={0}
        className="bookAgain--link"
      >
        <Icon className="icon-arrow-top-right" size="sm" />
      </button>
    </div>
  );
};

BookAgain.propTypes = {
  bookAgain: any,
};
export default BookAgain;
