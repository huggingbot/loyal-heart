import { useCallback } from 'react'

import { sharedContentWrapperStyle } from '../components/layout/ContentWrapper'
import { ReferralFormModal } from '../components/modal/form/ReferralFormModal'
import { AppHeader } from '../components/section/AppHeader'
import { SideMenu } from '../components/section/SideMenu'
import { useModal } from '../contexts/ModalContext'
import { useDeleteReferralMutation } from '../hooks/useDeleteReferralMutation'
import { useGetReferralsQuery } from '../hooks/useGetReferralsQuery'

export const Referral = (): JSX.Element => {
  const query = useGetReferralsQuery()
  const deleteMutation = useDeleteReferralMutation()

  const onAddReferral = useCallback((success: boolean) => {
    if (success) {
      onDismissModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteReferral = useCallback(
    (id: number) => {
      void deleteMutation.mutateAsync(id)
    },
    [deleteMutation],
  )

  const { onShowModal, onDismissModal } = useModal(<ReferralFormModal onAddReferral={onAddReferral} />)

  return (
    <div className='flex flex-col'>
      <AppHeader />
      <div className='flex'>
        <SideMenu />
        <div className={`${sharedContentWrapperStyle} flex flex-col pt-16 px-16 gap-y-8 bg-white text-gray-500`}>
          <div className='flex justify-between'>
            <div className='text-xl font-semibold'>Referral</div>
            <button
              className='inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700'
              onClick={() => onShowModal()}
            >
              Add Referral
            </button>
          </div>
          <div className='overflow-x-auto border rounded border-gray-300'>
            <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
              <thead className='text-left'>
                <tr>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Referrer</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Referred</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Referrer Coupon</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Referred Coupon</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Referrer Coupon Usage Date</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Referred Coupon Usage Date</th>
                  <th className='px-4 py-2'></th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200'>
                {query.data?.map(referral => (
                  <tr key={referral.id} className='odd:bg-gray-50'>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{referral.referrerId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{referral.referredId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{referral.referrerCouponId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{referral.referredCouponId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                      {referral.referrerCouponUsageDate?.toString()}
                    </td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                      {referral.referredCouponUsageDate?.toString()}
                    </td>
                    <td className='whitespace-nowrap px-4 py-2'>
                      <button
                        className='inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700'
                        onClick={() => onDeleteReferral(referral.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
