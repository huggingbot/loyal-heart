import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useCreateCouponMutation } from '../../../hooks/useCreateCouponMutation'
import { useGetPartnersQuery } from '../../../hooks/useGetPartnersQuery'
import { useGetRewardsQuery } from '../../../hooks/useGetRewardsQuery'
import { useGetUsersQuery } from '../../../hooks/useGetUsersQuery'
import { Select } from '../../form/select'
import { EBaseModalSize } from '..'
import FormModal from './FormModal'

interface IProps {
  onAddCoupon: (success: boolean) => void
}

export const CouponFormModal = ({ onAddCoupon }: IProps): JSX.Element => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      code: '',
      rewardId: 0,
      partnerId: 0,
      userId: 0,
      usageCount: 0,
      maxUsage: 0,
      validFrom: undefined,
      validTo: undefined,
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

  const rewardQuery = useGetRewardsQuery()
  const partnerQuery = useGetPartnersQuery()
  const userQuery = useGetUsersQuery()
  const createMutation = useCreateCouponMutation()

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await createMutation.mutateAsync({ data: { ...filteredObj } })
          onAddCoupon(true)
          reset()
        } catch (err) {
          console.error('error', err)
          onAddCoupon(false)
        }
      })()
    },
    [handleSubmit, createMutation, onAddCoupon, reset],
  )

  const isSubmitButtonDisabled = !isValid || isSubmitting

  return (
    <FormModal modalSize={EBaseModalSize.Large} title={'Add a new coupon'}>
      <form className='mx-auto mb-0 mt-8 max-w-md space-y-4'>
        <div>
          <label htmlFor='code' className='block text-sm text-gray-500'>
            Code
          </label>
          <input
            id='code'
            type='text'
            placeholder='Code'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('code', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='reward' className='block text-sm text-gray-500'>
            Reward
          </label>
          <Select
            id='reward'
            options={rewardQuery.data?.map(reward => ({ value: reward.id, label: reward.name }))}
            {...register('rewardId', { required: true, valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='partner' className='block text-sm text-gray-500'>
            Partner
          </label>
          <Select
            id='partner'
            options={partnerQuery.data?.map(partner => ({ value: partner.id, label: partner.name }))}
            {...register('partnerId', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='user' className='block text-sm text-gray-500'>
            User
          </label>
          <Select
            id='user'
            options={userQuery.data?.map(user => ({ value: user.id, label: user.name }))}
            {...register('userId', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='usageCount' className='block text-sm text-gray-500'>
            Usage Count
          </label>
          <input
            id='usageCount'
            type='tel'
            placeholder='Usage Count'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('usageCount', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='usageCount' className='block text-sm text-gray-500'>
            Max Usage
          </label>
          <input
            id='maxUsage'
            type='tel'
            placeholder='Max Usage'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('maxUsage', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='validFrom' className='block text-sm text-gray-500'>
            Valid From
          </label>
          <input
            id='validFrom'
            type='date'
            placeholder='Valid From'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('validFrom', { setValueAs: value => (value ? new Date(value) : undefined) })}
          />
        </div>

        <div>
          <label htmlFor='validTo' className='block text-sm text-gray-500'>
            Valid To
          </label>
          <input
            id='validTo'
            type='date'
            placeholder='Valid To'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('validTo', { setValueAs: value => (value ? new Date(value) : undefined) })}
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
            Add Coupon
          </button>
        </div>
      </form>
    </FormModal>
  )
}
