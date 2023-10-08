import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useCreateRewardMutation } from '../../../hooks/useCreateRewardMutation'
import { Select } from '../../form/select'
import { EBaseModalSize } from '..'
import FormModal from './FormModal'

interface IProps {
  onAddReward: (success: boolean) => void
}

export const RewardFormModal = ({ onAddReward }: IProps): JSX.Element => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      type: '' as 'discount_percent' | 'discount_value' | 'points',
      value: 0,
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

  const createMutation = useCreateRewardMutation()

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await createMutation.mutateAsync({ data: { ...filteredObj } })
          onAddReward(true)
          reset()
        } catch (err) {
          console.error('error', err)
          onAddReward(false)
        }
      })()
    },
    [handleSubmit, createMutation, onAddReward, reset],
  )

  const isSubmitButtonDisabled = !isValid || isSubmitting

  return (
    <FormModal modalSize={EBaseModalSize.Large} title={'Add a new reward'}>
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
          <label htmlFor='type' className='block text-sm text-gray-500'>
            Type
          </label>
          <Select
            id='type'
            options={['points', 'discount_percent', 'discount_value'].map(i => ({
              value: i,
              label: i.replaceAll('_', ' '),
            }))}
            {...register('type', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='value' className='block text-sm text-gray-500'>
            Value
          </label>
          <input
            id='value'
            type='tel'
            placeholder='Value'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('value', { required: true, valueAsNumber: true })}
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
            Add Reward
          </button>
        </div>
      </form>
    </FormModal>
  )
}
