import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import FilterSwitch from './FilterSwitch';

const Filter = (props) => {
  const { slidePaneData } = props;
  const { sliderTitle, sliderDescription } = slidePaneData || {};
  const { state, dispatch } = React.useContext(AppContext);

  /* Old Code:
  const selectionHandlerNonVeg = (diet) => {
    let payload;

    if (state.mealFilters.includes(diet)) {
      payload = state.mealFilters.filter((fil) => fil !== diet);
    } else {
      payload = [...state.mealFilters, diet].filter(
        (fil) => fil !== props.slidePaneData.veg,
      );
    }
    applyFilterHandler(payload);
  };

  const selectionHandlerVeg = (diet) => {
    let payload;

    if (state.mealFilters.includes(diet)) {
      payload = state.mealFilters.filter((fil) => fil !== diet);
    } else {
      payload = [...state.mealFilters, diet].filter(
        (fil) => fil !== props.slidePaneData.nonVeg,
      );
    }
    applyFilterHandler(payload);
  }; */
  const applyFilterHandler = (payload) => {
    dispatch({
      type: addonActions.SET_MEAL_FILTERS,
      payload,
    });
  };

  const filterHandler = (diet) => {
    let payload;
    if (state.mealFilters.includes(diet)) {
      payload = state.mealFilters.filter((fil) => fil !== diet);
    } else if (diet === slidePaneData.veg) {
      payload = [...state.mealFilters, diet].filter(
        (fil) => fil === slidePaneData.veg,
      );
    } else if (diet === slidePaneData.nonVeg) {
      payload = [...state.mealFilters, diet].filter(
        (fil) => fil === slidePaneData.nonVeg,
      );
    } else if (diet === slidePaneData.bestseller) {
      payload = [...state.mealFilters, diet].filter(
        (fil) => fil === slidePaneData.bestseller,
      );
    }
    applyFilterHandler(payload);
  };

  const handleInputChange = (e) => {
    dispatch({
      type: addonActions.SET_MEAL_SEARCH,
      payload: e.target.value,
    });
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: addonActions.SET_MEAL_FILTERS,
        payload: [],
      });
      dispatch({
        type: addonActions.SET_MEAL_SEARCH,
        payload: '',
      });
    };
  }, []);

  return (
    <div className="skyplus-addon-filter">
      <div className="skyplus-tiffin-slide__title h0">{sliderTitle}</div>
      <Heading heading="h4" containerClass="skyplus-tiffin-slide__description">
        <div
          dangerouslySetInnerHTML={{
            __html: sliderDescription.html,
          }}
        />
      </Heading>
      <div className="skyplus-addon-filter__search">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjAxOTUgMTguNDg0NEwyMS41NDM2IDIxLjk5OTIiIHN0cm9rZT0iI0E3QjNENyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTEuNzY1OSAyMC43NTQ1QzE2LjczMDEgMjAuNzU0NSAyMC43NTQ1IDE2LjczMDEgMjAuNzU0NSAxMS43NjU5QzIwLjc1NDUgNi44MDE2NiAxNi43MzAxIDIuNzc3MzQgMTEuNzY1OSAyLjc3NzM0QzYuODAxNjYgMi43NzczNCAyLjc3NzM0IDYuODAxNjYgMi43NzczNCAxMS43NjU5QzIuNzc3MzQgMTYuNzMwMSA2LjgwMTY2IDIwLjc1NDUgMTEuNzY1OSAyMC43NTQ1WiIgc3Ryb2tlPSIjMjQ0MDlBIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
          width={20}
          height={20}
        />
        <input
          type="text"
          name="search"
          value={state.mealSearch}
          autoComplete="off"
          placeholder="Search"
          onChange={handleInputChange}
          maxLength="20"
        />
      </div>
      <div className="skyplus-addon-filter__btn">
        {!!slidePaneData.bestseller && (
          <div className="skyplus-addon-filter__btn_wrapper">
            <FilterSwitch
              label={slidePaneData.bestseller}
              selected={state.mealFilters.includes(slidePaneData.bestseller)}
              onClickHandler={() => filterHandler(slidePaneData.bestseller)}
              preIcon={(
                <i className="icon-bestsellar-solid me-2">
                  <span className="path1" />
                  <span className="path2" />
                </i>
              )}
            />
          </div>
        )}

        {!!slidePaneData.nonVeg && (
          <div className="skyplus-addon-filter__btn_wrapper">
            <FilterSwitch
              label={slidePaneData.nonVeg}
              selected={state.mealFilters.includes(slidePaneData.nonVeg)}
              onClickHandler={() => filterHandler(slidePaneData.nonVeg)}
              preIcon={<i className="icon-non-veg me-2" />}
            />
          </div>
        )}

        {!!slidePaneData.veg && (
          <div className="skyplus-addon-filter__btn_wrapper">
            <FilterSwitch
              label={slidePaneData.veg}
              selected={state.mealFilters.includes(slidePaneData.veg)}
              onClickHandler={() => filterHandler(slidePaneData.veg)}
              preIcon={<i className="icon-veg me-2" />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Filter.propTypes = {
  slidePaneData: PropTypes.object,
};

export default Filter;
