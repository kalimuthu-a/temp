import PropTypes from 'prop-types';
import React, {
  useEffect,
  useMemo,
} from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import RadioBox from 'skyplus-design-system-app/dist/des-system/RadioBox';

import Popover from '../../../common/Popover/Popover';

import useAppContext from '../../../../hooks/useAppContext';
import FormField from '../../../Form/FormField';
import { useCargo } from '../../CargoContext';
import { cargoFormActions } from '../../CargoReducer';

const GoodsTypeSelector = ({
  containerClass,
}) => {
  const {
    state: { goodsType },
    dispatch,
  } = useCargo();

  const {
    state: { main },
  } = useAppContext();

  const goodsTypeOptions = useMemo(() => {
    return main.goodsType;
  }, []);

  const onChangeGoodsType = (key) => {
    const selectedGoodsType = goodsTypeOptions.find((item) => item.key === key);
    dispatch({
      type: cargoFormActions.CHANGE_GOODSTYPE_BY,
      payload: { goodsType: selectedGoodsType },
    });
  };

  /**
 * Finds the next item in an array based on a given key.
 * @param {Array<{ key: string, value: string }>} arr - The array to search.
 * @param {string} currentKey - The key to find the next item for.
 * @returns {{ key: string, value: string } | null} - The next item, or null if not found.
 */
const findNextItem = (arr, currentKey) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const index = arr.findIndex((item) => item.key === currentKey);

  return (index !== -1 && index < arr.length - 1) ? arr[index + 1] : arr[0];
};

  useEffect(() => {
    dispatch({
      type: cargoFormActions.CHANGE_GOODSTYPE_BY,
      payload: { goodsType: goodsTypeOptions[0] },
    });
  }, []);

  return (
    <Popover
      renderElement={() => {
        return (
          <FormField
            containerClass="notsearchable goods-type-block"
            topLabel={main?.goodsTypeLabel}
            middleLabel={goodsType?.value}
            hintLabel={findNextItem(goodsTypeOptions, goodsType?.key)?.value}
            filled
            accessiblityProps={{
              'aria-label': 'Goods Type Selection',
            }}
          />
        );
      }}
      renderPopover={() => {
        return (
          <div className="goods-type-selector">
            {goodsTypeOptions.map(({ value: val, key }) => (
              <div className="goods-type__item" key={key}>
                <RadioBox
                  onChange={onChangeGoodsType}
                  value={key}
                  id={`reason-${key}`}
                  checked={key === goodsType?.key}
                />
                <p>{val}</p>
              </div>
            ))}
          </div>
          
        );
      }}
      containerClass={containerClass}
    />
  );
};

GoodsTypeSelector.propTypes = {
  containerClass: PropTypes.string,
};

export default GoodsTypeSelector;
