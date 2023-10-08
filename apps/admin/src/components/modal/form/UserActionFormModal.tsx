import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useCreateUserActionMutation } from '../../../hooks/useCreateUserActionMutation'
import { Select } from '../../form/select'
import { EBaseModalSize } from '..'
import FormModal from './FormModal'

interface IProps {
  onAddUserAction: (success: boolean) => void
}

export const UserActionFormModal = ({ onAddUserAction }: IProps): JSX.Element => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      category: '' as
        | 'points_earned'
        | 'points_spent'
        | 'discount_percent_earned'
        | 'discount_percent_spent'
        | 'discount_value_earned'
        | 'discount_value_spent',
    },
    reValidateMode: 'onBlur',
    shouldFocusError: false,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = form

  const createMutation = useCreateUserActionMutation()

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await createMutation.mutateAsync({ data: { ...filteredObj } })
          onAddUserAction(true)
          reset()
        } catch (err) {
          console.error('error', err)
          onAddUserAction(false)
        }
      })()
    },
    [handleSubmit, createMutation, onAddUserAction, reset],
  )

  const isSubmitButtonDisabled = !isValid || isSubmitting

  return (
    <FormModal modalSize={EBaseModalSize.Large} title={'Add a new user action'}>
      <form className='mx-auto mb-0 mt-8 max-w-md space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm text-gray-500'>
            Name
          </label>
          <input
            id='name'
            type='text'
            placeholder='Name'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('name', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='category' className='block text-sm text-gray-500'>
            Category
          </label>
          <Select
            id='category'
            options={[
              'points_earned',
              'points_spent',
              'discount_percent_earned',
              'discount_percent_spent',
              'discount_value_earned',
              'discount_value_spent',
            ].map(i => ({
              value: i,
              label: i.replaceAll('_', ' '),
            }))}
            {...register('category', { required: true })}
          />
        </div>

        <div className='mt-8 flex justify-center'>
          <button
            type='submit'
            className={`inline-block rounded border  px-12 py-3 text-sm font-medium 
            ${
              isSubmitButtonDisabled
                ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500'
            }`}
            disabled={isSubmitButtonDisabled}
            onClick={onSubmit}
          >
            Add User Action
          </button>
        </div>
      </form>
    </FormModal>
  )
}
