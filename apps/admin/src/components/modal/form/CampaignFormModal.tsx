import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useCreateCampaignMutation } from '../../../hooks/useCreateCampaignMutation'
import { useGetCouponsQuery } from '../../../hooks/useGetCouponsQuery'
import { useGetPartnersQuery } from '../../../hooks/useGetPartnersQuery'
import { useGetUserActionsQuery } from '../../../hooks/useGetUserActionsQuery'
import { Select } from '../../form/select'
import { EBaseModalSize } from '..'
import FormModal from './FormModal'

interface IProps {
  onAddCampaign: (success: boolean) => void
}

export const CampaignFormModal = ({ onAddCampaign }: IProps): JSX.Element => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      partnerId: 0,
      userActionId: 0,
      couponId: 0,
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

  const partnerQuery = useGetPartnersQuery()
  const userActionQuery = useGetUserActionsQuery()
  const couponQuery = useGetCouponsQuery()
  const createMutation = useCreateCampaignMutation()

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await createMutation.mutateAsync({ data: { ...filteredObj } })
          onAddCampaign(true)
          reset()
        } catch (err) {
          console.error('error', err)
          onAddCampaign(false)
        }
      })()
    },
    [handleSubmit, createMutation, onAddCampaign, reset],
  )

  const isSubmitButtonDisabled = !isValid || isSubmitting

  return (
    <FormModal modalSize={EBaseModalSize.Large} title={'Add a new campaign'}>
      <form className='mx-auto mb-0 mt-8 max-w-md space-y-4'>
        <div>
          <label htmlFor='partner' className='block text-sm text-gray-500'>
            Partner
          </label>
          <Select
            id='partner'
            options={partnerQuery.data?.map(partner => ({ value: partner.id, label: partner.name }))}
            {...register('partnerId', { required: true, valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='userAction' className='block text-sm text-gray-500'>
            User Action
          </label>
          <Select
            id='userAction'
            options={userActionQuery.data?.map(userAction => ({ value: userAction.id, label: userAction.name }))}
            {...register('userActionId', { required: true, valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor='coupon' className='block text-sm text-gray-500'>
            Coupon
          </label>
          <Select
            id='coupon'
            options={couponQuery.data?.map(coupon => ({ value: coupon.id, label: coupon.code }))}
            {...register('couponId', { required: true, valueAsNumber: true })}
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
            Add Campaign
          </button>
        </div>
      </form>
    </FormModal>
  )
}
