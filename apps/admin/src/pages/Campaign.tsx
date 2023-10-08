import { useCallback } from 'react'

import { sharedContentWrapperStyle } from '../components/layout/ContentWrapper'
import { CampaignFormModal } from '../components/modal/form/CampaignFormModal'
import { AppHeader } from '../components/section/AppHeader'
import { SideMenu } from '../components/section/SideMenu'
import { useModal } from '../contexts/ModalContext'
import { useDeleteCampaignMutation } from '../hooks/useDeleteCampaignMutation'
import { useGetCampaignsQuery } from '../hooks/useGetCampaignsQuery'

export const Campaign = (): JSX.Element => {
  const query = useGetCampaignsQuery()
  const deleteMutation = useDeleteCampaignMutation()

  const onAddCampaign = useCallback((success: boolean) => {
    if (success) {
      onDismissModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteCampaign = useCallback(
    (id: number) => {
      void deleteMutation.mutateAsync(id)
    },
    [deleteMutation],
  )

  const { onShowModal, onDismissModal } = useModal(<CampaignFormModal onAddCampaign={onAddCampaign} />)

  return (
    <div className='flex flex-col'>
      <AppHeader />
      <div className='flex'>
        <SideMenu />
        <div className={`${sharedContentWrapperStyle} flex flex-col pt-16 px-16 gap-y-8 bg-white text-gray-500`}>
          <div className='flex justify-between'>
            <div className='text-xl font-semibold'>Campaign</div>
            <button
              className='inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700'
              onClick={() => onShowModal()}
            >
              Add Campaign
            </button>
          </div>
          <div className='overflow-x-auto border rounded border-gray-300'>
            <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
              <thead className='text-left'>
                <tr>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Partner</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>User Action</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Coupon</th>
                  <th className='px-4 py-2'></th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200'>
                {query.data?.map(campaign => (
                  <tr key={campaign.id} className='odd:bg-gray-50'>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{campaign.partnerId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{campaign.userActionId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{campaign.couponId}</td>
                    <td className='whitespace-nowrap px-4 py-2'>
                      <button
                        className='inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700'
                        onClick={() => onDeleteCampaign(campaign.id)}
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
