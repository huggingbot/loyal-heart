import { useCallback } from 'react'

import { sharedContentWrapperStyle } from '../components/layout/ContentWrapper'
import { UserFormModal } from '../components/modal/form/UserFormModal'
import { AppHeader } from '../components/section/AppHeader'
import { SideMenu } from '../components/section/SideMenu'
import { useModal } from '../contexts/ModalContext'
import { useDeleteUserMutation } from '../hooks/useDeleteUserMutation'
import { useGetUsersQuery } from '../hooks/useGetUsersQuery'

export const User = (): JSX.Element => {
  const query = useGetUsersQuery()
  const deleteMutation = useDeleteUserMutation()

  const onAddUser = useCallback((success: boolean) => {
    if (success) {
      onDismissModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteUser = useCallback(
    (id: number) => {
      void deleteMutation.mutateAsync(id)
    },
    [deleteMutation],
  )

  const { onShowModal, onDismissModal } = useModal(<UserFormModal onAddUser={onAddUser} />)

  return (
    <div className='flex flex-col'>
      <AppHeader />
      <div className='flex'>
        <SideMenu />
        <div className={`${sharedContentWrapperStyle} flex flex-col pt-16 px-16 gap-y-8 bg-white text-gray-500`}>
          <div className='flex justify-between'>
            <div className='text-xl font-semibold'>User</div>
            <button
              className='inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700'
              onClick={() => onShowModal()}
            >
              Add User
            </button>
          </div>
          <div className='overflow-x-auto border rounded border-gray-300'>
            <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
              <thead className='text-left'>
                <tr>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Partner</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Name</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Date of Birth</th>
                  <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Phone</th>
                  <th className='px-4 py-2'></th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200'>
                {query.data?.map(user => (
                  <tr key={user.id} className='odd:bg-gray-50'>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{user.partnerId}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-900'>{user.name}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{user.dateOfBirth?.toString()}</td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>{user.phoneNumber}</td>
                    <td className='whitespace-nowrap px-4 py-2'>
                      <button
                        className='inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700'
                        onClick={() => onDeleteUser(user.id)}
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
