import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useCreateReferralMutation } from '../../../hooks/useCreateReferralMutation'
import { useGetCouponsQuery } from '../../../hooks/useGetCouponsQuery'
import { useGetUsersQuery } from '../../../hooks/useGetUsersQuery'
import { Select } from '../../form/select'
import { EBaseModalSize } from '..'
import FormModal from './FormModal'

interface IProps {
  onAddReferral: (success: boolean) => void
}

export const ReferralFormModal = ({ onAddReferral }: IProps): JSX.Element => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      referrerId: 0,
      referredId: 0,
      referrerCouponId: undefined as number | undefined,
      referredCouponId: undefined as number | undefined,
      referrerCouponUsageDate: undefined,
      referredCouponUsageDate: undefined,
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

  const userQuery = useGetUsersQuery()
  const couponQuery = useGetCouponsQuery()
  const createMutation = useCreateReferralMutation()

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await createMutation.mutateAsync({ data: { ...filteredObj } })
          onAddReferral(true)
          reset()
        } catch (err) {
          console.error('error', err)
          onAddReferral(false)
        }
      })()
    },
    [handleSubmit, createMutation, onAddReferral, reset],
  )

  const isSubmitButtonDisabled = !isValid || isSubmitting

  return (
    <FormModal modalSize={EBaseModalSize.Large} title={'Add a new referral'}>
      <form className='mx-auto mb-0 mt-8 max-w-md space-y-4'>
        <div>
          <label htmlFor='referrer' className='block text-sm text-gray-500'>
            Referrer
          </label>
          <Select
            id='referrer'
            options={userQuery.data?.map(referrer => ({ value: referrer.id, label: referrer.name }))}
            {...register('referrerId', { required: true, valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='referred' className='block text-sm text-gray-500'>
            Referred
          </label>
          <Select
            id='referred'
            options={userQuery.data?.map(referred => ({ value: referred.id, label: referred.name }))}
            {...register('referredId', { required: true, valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='referrerCoupon' className='block text-sm text-gray-500'>
            Referrer Coupon
          </label>
          <Select
            id='referrerCoupon'
            options={couponQuery.data?.map(referrerCoupon => ({
              value: referrerCoupon.id,
              label: referrerCoupon.code,
            }))}
            {...register('referrerCouponId', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='referredCoupon' className='block text-sm text-gray-500'>
            Referred Coupon
          </label>
          <Select
            id='referredCoupon'
            options={couponQuery.data?.map(referredCoupon => ({
              value: referredCoupon.id,
              label: referredCoupon.code,
            }))}
            {...register('referredCouponId', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='referrerCouponUsageDate' className='block text-sm text-gray-500'>
            Date of Birth
          </label>
          <input
            id='referrerCouponUsageDate'
            type='date'
            placeholder='Date of Birth'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('referrerCouponUsageDate', { setValueAs: value => (value ? new Date(value) : undefined) })}
          />
        </div>

        <div>
          <label htmlFor='referredCouponUsageDate' className='block text-sm text-gray-500'>
            Date of Birth
          </label>
          <input
            id='referredCouponUsageDate'
            type='date'
            placeholder='Date of Birth'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('referredCouponUsageDate', { setValueAs: value => (value ? new Date(value) : undefined) })}
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
            Add Referral
          </button>
        </div>
      </form>
    </FormModal>
  )
}
