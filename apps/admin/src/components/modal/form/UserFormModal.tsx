import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useCreateUserMutation } from '../../../hooks/useCreateUserMutation'
import { useGetPartnersQuery } from '../../../hooks/useGetPartnersQuery'
import { Select } from '../../form/select'
import { EBaseModalSize } from '..'
import FormModal from './FormModal'

interface IProps {
  onAddUser: (success: boolean) => void
}

export const UserFormModal = ({ onAddUser }: IProps): JSX.Element => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      partnerId: 0,
      name: '',
      dateOfBirth: undefined,
      phoneNumber: '',
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
  const createMutation = useCreateUserMutation()

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      void handleSubmit(async e => {
        try {
          const filteredObj = Object.fromEntries(Object.entries(e).filter(([, value]) => value)) as typeof e
          await createMutation.mutateAsync({ data: { ...filteredObj } })
          onAddUser(true)
          reset()
        } catch (err) {
          console.error('error', err)
          onAddUser(false)
        }
      })()
    },
    [handleSubmit, createMutation, onAddUser, reset],
  )

  const isSubmitButtonDisabled = !isValid || isSubmitting

  return (
    <FormModal modalSize={EBaseModalSize.Large} title={'Add a new user'}>
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
          <label htmlFor='dateOfBirth' className='block text-sm text-gray-500'>
            Date of Birth
          </label>
          <input
            id='dateOfBirth'
            type='date'
            placeholder='Date of Birth'
            className='block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            {...register('dateOfBirth', { setValueAs: value => (value ? new Date(value) : undefined) })}
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
            {...register('phoneNumber', { required: true })}
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
            Add User
          </button>
        </div>
      </form>
    </FormModal>
  )
}
