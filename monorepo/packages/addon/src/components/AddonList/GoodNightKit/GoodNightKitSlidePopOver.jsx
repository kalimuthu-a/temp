import React from 'react';
// Old Code:
// import PopoverComp from 'skyplus-design-system-app/dist/des-system/Popover';
import PropTypes from 'prop-types';

const GoodNightKitSlidePopOver = ({ ssrData }) => {
  /* Old Code:
  const [openedPopover, setOpenedPopover] = useState(false);

  const popoverProps = {
    placement: 'bottom',
    onMouseLeave: () => setOpenedPopover(!openedPopover),
    onMouseOver: () => setOpenedPopover(!openedPopover),
    onClick: () => setOpenedPopover(!openedPopover),
    onMouseEnter: () => setOpenedPopover(!openedPopover),
    targetElement: (
      <span
        id={`popover-${ssrData?.ssrKey}`}
        className="icon-info_24 indigoIcon"
        onClick={() => setOpenedPopover(!openedPopover)}
        onMouseOver={() => setOpenedPopover(!openedPopover)}
        onMouseLeave={() => setOpenedPopover(!openedPopover)}
      />
    ),
    content: ssrData?.ssrInformation?.html,
    targetId: `popover-${ssrData?.ssrKey}`,
    openedPopover,
  };

  return <PopoverComp {...popoverProps} />; */
  return <div>Popover - {ssrData?.ssrInformation?.html}</div>;
};

GoodNightKitSlidePopOver.propTypes = {
  ssrData: PropTypes.any,
};

export default GoodNightKitSlidePopOver;
