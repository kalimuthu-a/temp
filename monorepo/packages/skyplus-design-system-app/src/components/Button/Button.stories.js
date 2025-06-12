/* eslint-disable i18next/no-literal-string */
import React from 'react';
import Button, { SUCCESS } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

export const Primary = (args) => {
  const props = { ...args, color: 'primary', loading: true };
  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <Button {...props}>Primary</Button>
        <br />
        <Button {...{ disabled: true }}>Primary</Button>
        <br />
        <Button {...{ size: 'small' }}>Primary</Button>
        <br />
        <Button {...{ size: 'large', loading: true }}>Primary</Button>
        <br />
        <Button {...{ variant: 'outline', color: 'primary' }}>Primary</Button>
        <br />
        <Button {...{ size: 'large', variant: 'outline', color: 'primary' }}>
          Primary
        </Button>
        <br />
        <Button
          {...{
            size: 'small',
            variant: 'outline',
            color: 'primary',
            disabled: true,
          }}
        >
          Outlined disabled
        </Button>
        <br />

        <Button {...{ size: 'small', variant: 'outline', color: 'primary' }}>
          Primary
        </Button>
        <br />
        <Button
          {...{
            size: 'small',
            loading: true,
          }}
        >
          Primary Loading
        </Button>
        <br />
        <Button {...{ block: true }}>Primary</Button>
      </div>
      <div>
        <Button {...{ ...props, color: SUCCESS }}>Success</Button>
        <br />
        <Button {...{ disabled: true }}>Primary</Button>
        <br />
        <Button {...{ size: 'small', color: SUCCESS }}>Primary</Button>
        <br />
        <Button {...{ size: 'large', loading: true }}>Primary</Button>
        <br />
        <Button {...{ variant: 'outline', color: SUCCESS }}>Primary</Button>
        <br />
        <Button {...{ size: 'large', variant: 'outline', color: 'primary' }}>
          Primary
        </Button>
        <br />
        <Button {...{ size: 'small', variant: 'outline', color: 'primary' }}>
          Primary
        </Button>
        <br />
        <Button
          {...{
            size: 'small',
            loading: true,
          }}
        >
          Primary Loading
        </Button>
        <br />
        <Button {...{ block: true }}>Primary</Button>
      </div>
    </div>
  );
};
