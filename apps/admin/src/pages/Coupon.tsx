import { useCallback } from 'react'

import { sharedContentWrapperStyle } from '../components/layout/ContentWrapper'
import { CouponFormModal } from '../components/modal/form/CouponFormModal'
import { AppHeader } from '../components/section/AppHeader'
import { SideMenu } from '../components/section/SideMenu'
import { useModal } from '../contexts/ModalContext'
import { useDeleteCouponMutation } from '../hooks/useDeleteCouponMutation'
import { useGetCouponsQuery } from '../hooks/useGetCouponsQuery'

export const Coupon = (): JSX.Element => {
  const query = useGetCouponsQuery()
  const deleteMutation = useDeleteCouponMutation()

  const onAddCoupon = useCallback((success: boolean) => {
    if (success) {
      onDismissModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteCoupon = useCallback(
    (id: number) => {
      void deleteMutation.mutateAsync(id)
    },
    [deleteMutation],
  )

  const { onShowModal, onDismissModal } = useModal(<CouponFormModal onAddCoupon={onAddCoupon} />)

  return (
    <div className='flex flex-col'>
      <AppHeader />
      <div className='flex'>
        <SideMenu />
        <div className={`${sharedContentWrapperStyle} flex flex-col pt-16 px-16 gap-y-8 bg-white text-gray-500`}>
          <div className='flex justify-between'>
            <div className='text-xl font-semibold'>Coupon</div>
            <button
              className='inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700'
              onClick={() => onShowModal()}
            >
              Add Coupon
            </button>
          </div>
          <div className='overflow-x-auto border rounded border-gray-300'>
            <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
              <thead className='text-left'>
                <tr>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Code</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Reward</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Partner</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>User</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Usage Count</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Max Usage</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Valid From</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Valid To</th>
                  <th className='px-4 py-2'></th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200'>
                {query.data?.map(coupon => (
                  <tr key={coupon.id} className='odd:bg-gray-50'>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{coupon.code}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{coupon.rewardId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{coupon.partnerId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{coupon.userId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{coupon.usageCount}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{coupon.maxUsage}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{coupon.validFrom?.toString()}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{coupon.validTo?.toString()}</td>
                    <td className='whitespace-nowrap px-4 py-2'>
                      <button
                        className='inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700'
                        onClick={() => onDeleteCoupon(coupon.id)}
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
