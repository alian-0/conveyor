import { type ComponentProps, type ElementRef, forwardRef } from 'react';

import type { GroupBase } from 'react-select';
import Creatable, { type CreatableProps } from 'react-select/creatable';

import type { FormControlChildProps } from '@/Form';
import { cn } from '@/lib/utils';

declare module 'react-select/base' {
  export interface CreatableProps<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>,
  > {
    clearValue?: () => void;
  }
}

export interface CreatableSelectInputProps
  extends CreatableProps<any, boolean, GroupBase<any>>,
    Pick<FormControlChildProps, 'disabled'> {}

export const CreatableSelectInput = forwardRef<
  ElementRef<typeof Creatable>,
  CreatableSelectInputProps
>(({ id, disabled, className, options, ...props }, ref) => {
  const defaultStyling: ComponentProps<typeof Creatable>['classNames'] = {
    clearIndicator: ({ isFocused }) =>
      cn(
        isFocused ? 'text-muted-foreground' : 'text-foreground',
        'p-2',
        isFocused ? 'hover:text-foreground' : 'hover:text-muted-foreground',
      ),
    //use 'container' key for selectContainer component!!
    //container: () => cn(),
    control: ({ isDisabled }) =>
      cn(
        'bg-background',
        isDisabled && 'opacity-50',
        'border-solid',
        'border',
        'rounded-md',
        'flex-nowrap',
        'items-center',
      ),
    dropdownIndicator: ({ isFocused }) =>
      cn(
        'p-2',
        isFocused
          ? 'text-muted-foreground hover:text-foreground'
          : 'text-foreground hover:text-muted-foreground',
      ),
    group: () => cn('py-2'),
    groupHeading: () =>
      cn(
        'text-muted-foreground',
        'text-xs',
        'font-medium',
        'mb-1',
        'px-3',
        'uppercase',
      ),
    indicatorsContainer: () => cn('inline-block'),
    indicatorSeparator: () => cn('bg-foreground', 'my-2'),
    input: () => cn('m-0.5', 'py-0.5', 'text-muted-foreground'),
    // loadingIndicator: ({ isFocused }) =>
    //   cn(isFocused ? 'text-neutral-600' : 'text-neutral-200', 'p-2'),
    // loadingMessage: () => cn('text-neutral-400', 'py-2', 'px-3'),
    menu: () =>
      cn(
        'bg-background',
        'rounded-md',
        'my-1',
        'mt-2',
        'px-1',
        'border',
        'border-border',
        'min-w-fit',
      ),
    menuList: () => cn('py-1'),
    // menuPortal: () => cn(),
    multiValue: () => cn('bg-secondary', 'rounded-md', 'm-0.5'),
    multiValueLabel: () =>
      cn('rounded-md', 'text-foreground', 'text-sm', 'px-1'),
    multiValueRemove: () =>
      cn(
        'rounded-md',
        'px-1',
        'hover:bg-destructive',
        'hover:text-destructive-foreground',
        'bg-inherit',
      ),
    noOptionsMessage: () => cn('text-muted-foreground', 'py-2', 'px-3'),
    option: ({ isFocused, isSelected }) =>
      cn(
        isFocused ? 'bg-secondary' : 'bg-transparent',
        isSelected ? 'font-bold' : 'text-sm',
        'py-2',
        'px-3',
        'rounded-md',
      ),
    placeholder: () => cn('text-muted-foreground', 'mx-0.5', 'text-sm'),
    singleValue: () =>
      cn(
        //isDisabled ? 'text-neutral-400' : 'text-neutral-800',
        'text-sm',
        'mx-0.5',
      ),
    valueContainer: () =>
      cn('py-0.5', 'px-3', 'overflow-visible', 'inline-block'),
  };

  return (
    <div
      className={cn(
        'rounded-md ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <Creatable
        ref={ref}
        unstyled
        classNames={defaultStyling}
        isDisabled={disabled}
        options={options}
        inputId={id}
        menuPlacement="auto"
        {...props}
      />
    </div>
  );
});