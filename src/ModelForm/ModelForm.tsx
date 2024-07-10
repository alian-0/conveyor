import type { ComponentProps } from 'react';
import type { UseFormProps } from 'react-hook-form';

import { FormStoreProvider } from '@/Form';
import { Lenses } from '@/Lenses';
import { LoadingStoreProvider } from '@/Loading';
import { DataLens, type DataType, type Field } from '@/types';
import { toField } from '@/utils';

import { ModelFormActions } from './ModelFormActions';
import { ModelFormContent } from './ModelFormContent';
import { ModelFormFallback } from './ModelFormFallback';
import { ModelFormField } from './ModelFormField';
import {
  type ModelFormState,
  ModelFormStoreProvider,
} from './ModelFormStoreContext';
import { ModelFormTitle } from './ModelFormTitle';
import { cn } from '@/lib/utils';

export interface ModelFormProps<D extends DataType>
  extends Omit<ModelFormState<D>, 'fields'>,
    Omit<ComponentProps<'form'>, 'title' | 'onSubmit'> {
  fields: (string | Field)[];
  formOptions?: UseFormProps;
}

export const ModelForm = Object.assign(
  <D extends DataType>({
    title,
    fields,
    data,
    readOnly = true,
    onCreate,
    onUpdate,
    onDelete,
    onEdit,
    onCancelEdit,
    initialLens = DataLens.INPUT,
    children,
    formOptions,
    className,
    ...htmlProps
  }: ModelFormProps<D>) => {
    const formProps = Object.assign(
      { mode: 'onChange', values: data },
      formOptions,
    );
    return (
      <ModelFormStoreProvider
        title={title}
        fields={fields.map(toField)}
        data={data}
        readOnly={readOnly}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={onEdit}
        onCancelEdit={onCancelEdit}
        initialLens={initialLens}
      >
        <FormStoreProvider {...formProps}>
          <LoadingStoreProvider>
            <Form className={cn('space-y-4', className)} {...htmlProps}>
              <Lenses initialLens={initialLens}>
                {children === undefined ? (
                  <>
                    <ModelForm.Title />
                    <ModelForm.Content />
                    <ModelForm.Actions />
                    <ModelForm.Fallback />
                  </>
                ) : (
                  children
                )}
              </Lenses>
            </Form>
          </LoadingStoreProvider>
        </FormStoreProvider>
      </ModelFormStoreProvider>
    );
  },
  {
    Actions: ModelFormActions,
    Content: ModelFormContent,
    Fallback: ModelFormFallback,
    Field: ModelFormField,
    Title: ModelFormTitle,
  },
);

interface FormProps extends Omit<ComponentProps<'form'>, 'title'> {}

const Form = ({ children, ...htmlProps }: FormProps) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} {...htmlProps}>
      {children}
    </form>
  );
};
