import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { Select } from '../components/form/select'
import { sharedContentWrapperStyle } from '../components/layout/ContentWrapper'
import { AppHeader } from '../components/section/AppHeader'
import { SideMenu } from '../components/section/SideMenu'
import { useCreateUserMutation } from '../hooks/useCreateUserMutation'
import { useGetCouponsQuery } from '../hooks/useGetCouponsQuery'
import { useGetPartnersQuery } from '../hooks/useGetPartnersQuery'
import { useGetUsersQuery } from '../hooks/useGetUsersQuery'
import { useUserPurchaseMutation } from '../hooks/useUserPurchaseMutation'

export const Overview = (): JSX.Element => {
  const userRegForm = useForm({
    mode: 'onBlur',
    defaultValues: {
      partnerId: 0,
      name: '',
      dateOfBirth: undefined,
      phoneNumber: '',
      referrerPhone: '',
    },
    reValidateMode: 'onBlur',
    shouldFocusError: false,
  })

  const userPurchaseForm = useForm({
    mode: 'onBlur',
    defaultValues: {
      userId: 0,
      couponId: 0,
    },
    reValidateMode: 'onBlur',
    shouldFocusError: false,
  })

  const partnerQuery = useGetPartnersQuery()
  const userQuery = useGetUsersQuery()
  const couponQuery = useGetCouponsQuery()
  const userCreateMutation = useCreateUserMutation()
  const userPurchaseMutation = useUserPurchaseMutation()

  const onUserRegSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void userRegForm.handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await userCreateMutation.mutateAsync({ data: { ...filteredObj } })
          userRegForm.reset()
        } catch (err) {
          console.error('error', err)
        }
      })()
    },
    [userRegForm, userCreateMutation],
  )

  const onUserPurchaseSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void userPurchaseForm.handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await userPurchaseMutation.mutateAsync({ data: { ...filteredObj } })
          userPurchaseForm.reset()
        } catch (err) {
          console.error('error', err)
        }
      })()
    },
    [userPurchaseForm, userPurchaseMutation],
  )

  const isUserRegSubmitButtonDisabled = !userRegForm.formState.isValid || userRegForm.formState.isSubmitting
  const isUserPurchaseSubmitButtonDisabled =
    !userPurchaseForm.formState.isValid || userPurchaseForm.formState.isSubmitting

  return (
    <div className='flex flex-col'>
      <AppHeader />
      <div className='flex'>
        <SideMenu />
        <div className='flex w-full bg-white'>
          <div className='flex flex-col grow items-center'>
            <div
              className={`${sharedContentWrapperStyle} flex flex-col pt-16 pl-16 gap-y-32 bg-white text-gray-500 text-center`}
            >
              User Registration With Referral
            </div>
            <form className='bg-white space-y-4 max-w-lg m-4'>
              <div>
                <label htmlFor='partner' className='block text-sm text-gray-500'>
                  Partner
                </label>
                <Select
                  id='partner'
                  options={partnerQuery.data?.map(partner => ({ value: partner.id, label: partner.name }))}
                  {...userRegForm.register('partnerId', { required: true, valueAsNumber: true })}
                />
              </div>

              <div>
                <label htmlFor='name' className='block text-sm text-gray-500'>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  placeholder='Name'
                  className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
                  {...userRegForm.register('name', { required: true })}
                />
              </div>

              <div>
                <label htmlFor='dateOfBirth' className='block text-sm text-gray-500'>
                  Date of Birth
                </label>
                <input
                  id='dateOfBirth'
                  type='date'
                  placeholder='Date of Birth'
                  className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
                  {...userRegForm.register('dateOfBirth', {
                    setValueAs: value => (value ? new Date(value) : undefined),
                  })}
                />
              </div>

              <div>
                <label htmlFor='phone' className='block text-sm text-gray-500'>
                  Phone
                </label>
                <input
                  id='phone'
                  type='tel'
                  placeholder='Phone Number'
                  className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
                  {...userRegForm.register('phoneNumber', { required: true })}
                />
              </div>

              <div>
                <label htmlFor='referrer-phone' className='block text-sm text-gray-500'>
                  Referrer Phone
                </label>
                <input
                  id='referrer-phone'
                  type='tel'
                  placeholder='Referrer Phone Number'
                  className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
                  {...userRegForm.register('referrerPhone')}
                />
              </div>

              <div className='mt-8 flex justify-center'>
                <button
                  type='submit'
                  className={`inline-block rounded border  px-12 py-3 text-sm font-medium 
            ${
              isUserRegSubmitButtonDisabled
                ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500'
            }`}
                  disabled={isUserRegSubmitButtonDisabled}
                  onClick={onUserRegSubmit}
                >
                  Add User
                </button>
              </div>
            </form>
          </div>

          <div className='flex flex-col grow items-center'>
            <div
              className={`${sharedContentWrapperStyle} flex flex-col pt-16 pl-16 gap-y-32 bg-white text-gray-500 text-center`}
            >
              User Purchase
            </div>
            <form className='bg-white space-y-4 max-w-lg m-4'>
              <div>
                <label htmlFor='user' className='block text-sm text-gray-500'>
                  User
                </label>
                <Select
                  id='user'
                  options={userQuery.data?.map(user => ({ value: user.id, label: user.name }))}
                  {...userPurchaseForm.register('userId', { required: true, valueAsNumber: true })}
                />
              </div>

              <div>
                <label htmlFor='coupon' className='block text-sm text-gray-500'>
                  Coupon
                </label>
                <Select
                  id='coupon'
                  options={couponQuery.data?.map(coupon => ({ value: coupon.id, label: coupon.code }))}
                  {...userPurchaseForm.register('couponId', { required: true, valueAsNumber: true })}
                />
              </div>

              <div className='mt-8 flex justify-center'>
                <button
                  type='submit'
                  className={`inline-block rounded border  px-12 py-3 text-sm font-medium 
            ${
              isUserPurchaseSubmitButtonDisabled
                ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500'
            }`}
                  disabled={isUserPurchaseSubmitButtonDisabled}
                  onClick={onUserPurchaseSubmit}
                >
                  Add User Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
