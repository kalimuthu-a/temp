import React, { useState } from 'react';
import Chip from './Chip';
import NextChip from './NextChip';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    variant: 'filled',
  },
  args: {
    variant: 'filled',
  },
};

export const Primary = (args) => {
  const props = {
    ...args,
    color: 'primary-main',
    variant: 'outlined',
    withBorder: true,
    size: 'xs',
  };
  return (
    <>
      <div className="d-flex gap-10">
        <Chip {...props}>Recommended</Chip>
        <Chip {...props} border="secondary-main">
          Recommended
        </Chip>
      </div>
      <br />
      <Chip {...props} variant="text-outlined">
        Recommended
      </Chip>
      <br />

      <div className="d-flex gap-10">
        <Chip {...props} variant="text-outlined" size="sm">
          Recommended
        </Chip>
        <Chip
          {...props}
          variant="text-outlined"
          size="sm"
          border="secondary-main"
        >
          Recommended
        </Chip>
      </div>

      <br />

      <Chip {...props} variant="text-outlined" size="md">
        Recommended
      </Chip>
      <br />

      <Chip {...props} variant="filled" size="md">
        Recommended
      </Chip>

      <Chip {...props}>Recommended</Chip>
      <br />
      <Chip {...props} variant="text-outlined">
        Recommended
      </Chip>
      <br />

      <Chip {...props} variant="text-outlined" size="sm">
        Recommended
      </Chip>
      <br />

      <Chip {...props} variant="text-outlined" size="md">
        Recommended
      </Chip>
      <br />

      <Chip {...props} variant="filled" size="md" border="secondary-main">
        Recommended
      </Chip>
    </>
  );
};

export const Info = (args) => {
  const props = {
    ...args,
    color: 'secondary-light',
    variant: 'outlined',
    withBorder: true,
    size: 'xs',
  };
  return (
    <>
      <Chip {...props}>Info Chip Variations</Chip>
      <br />
      <Chip {...props} variant="text-outlined">
        Info Chip Variations
      </Chip>
      <br />

      <Chip {...props} variant="text-outlined" size="sm">
        Info Chip Variationss
      </Chip>
      <br />

      <Chip {...props} variant="text-outlined" size="md">
        Info Chip Variations
      </Chip>
      <br />

      <Chip {...props} variant="filled" size="md">
        Info Chip Variations
      </Chip>

      <Chip
        variant="filled"
        size="md"
        color="white"
        border="system-information"
        txtcol="system-information"
      >
        Info Chip Variations
      </Chip>

      <Chip
        {...props}
        variant="filled"
        size="sm"
        color="secondary-light"
        txtcol="system-information"
      >
        Info Chip Variationss
      </Chip>
      <Chip
        {...props}
        variant="filled"
        size="md"
        color="secondary-light"
        border="system-information"
        txtcol="text-primary"
      >
        Info Chip Variations
      </Chip>

      <Chip
        {...props}
        variant="filled"
        size="md"
        color="white"
        border="system-information"
        txtcol="text-secondary"
      >
        Info Chip Variations
      </Chip>

      <Chip
        {...props}
        variant="filled"
        size="md"
        color="white"
        border="secondary-main"
        txtcol="text-secondary"
      >
        Info Chip Variations
      </Chip>

      <Chip
        {...props}
        variant="filled"
        size="md"
        color="secondary-light"
        border="secondary-main"
        txtcol="text-primary"
      >
        Info Chip Variations
      </Chip>
    </>
  );
};

export const Success = (args) => {
  const props = {
    ...args,
    color: 'system-success',
    variant: 'outlined',
    withBorder: true,
    size: 'xs',
  };
  return (
    <>
      <Chip {...props}>Recommended</Chip>
      <br />
      <Chip {...props} variant="text-outlined">
        Recommended
      </Chip>
      <br />

      <Chip {...props} variant="text-outlined" size="sm">
        Recommended
      </Chip>
      <br />

      <Chip {...props} variant="text-outlined" size="md">
        Recommended
      </Chip>
      <br />

      <Chip
        {...props}
        variant="filled"
        size="md"
        color="secondary-light"
        border="system-success"
        txtcol="system-success"
      >
        Recommended
      </Chip>
    </>
  );
};

export const Next = () => {
  const [checked, setChecked] = useState(false);

  const onClickHandler = () => {
    setChecked(!checked);
  };

  return (
    <>
      <NextChip>NEXT</NextChip>
      <br />
      <NextChip>NEXT Only</NextChip>
      <br />
      <br />
      <NextChip withBorder tabIndex={-1}>
        NEXT Only{' '}
      </NextChip>
      <br />
      <br />
      <br />
      <br />
      <NextChip withBorder withCheckbox={checked} onClick={onClickHandler}>
        NEXT Only
      </NextChip>

      <br />
    </>
  );
};
