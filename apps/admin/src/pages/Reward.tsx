import { useCallback } from 'react'

import { sharedContentWrapperStyle } from '../components/layout/ContentWrapper'
import { RewardFormModal } from '../components/modal/form/RewardFormModal'
import { AppHeader } from '../components/section/AppHeader'
import { SideMenu } from '../components/section/SideMenu'
import { useModal } from '../contexts/ModalContext'
import { useDeleteRewardMutation } from '../hooks/useDeleteRewardMutation'
import { useGetRewardsQuery } from '../hooks/useGetRewardsQuery'

export const Reward = (): JSX.Element => {
  const query = useGetRewardsQuery()
  const deleteMutation = useDeleteRewardMutation()

  const onAddReward = useCallback((success: boolean) => {
    if (success) {
      onDismissModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteReward = useCallback(
    (id: number) => {
      void deleteMutation.mutateAsync(id)
    },
    [deleteMutation],
  )

  const { onShowModal, onDismissModal } = useModal(<RewardFormModal onAddReward={onAddReward} />)

  return (
    <div className='flex flex-col'>
      <AppHeader />
      <div className='flex'>
        <SideMenu />
        <div className={`${sharedContentWrapperStyle} flex flex-col pt-16 px-16 gap-y-8 bg-white text-gray-500`}>
          <div className='flex justify-between'>
            <div className='text-xl font-semibold'>Reward</div>
            <button
              className='inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700'
              onClick={() => onShowModal()}
            >
              Add Reward
            </button>
          </div>
          <div className='overflow-x-auto border rounded border-gray-300'>
            <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
              <thead className='text-left'>
                <tr>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Name</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Type</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Value</th>
                  <th className='px-4 py-2'></th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200'>
                {query.data?.map(reward => (
                  <tr key={reward.id} className='odd:bg-gray-50'>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{reward.name}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{reward.type}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{reward.value}</td>
                    <td className='whitespace-nowrap px-4 py-2'>
                      <button
                        className='inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700'
                        onClick={() => onDeleteReward(reward.id)}
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
