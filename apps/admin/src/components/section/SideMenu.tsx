import { useLocation, useNavigate } from 'react-router-dom'

export const SideMenu = (): JSX.Element => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className='flex h-screen flex-col justify-between border-e bg-white min-w-[240px]'>
      <div className='px-4 py-6'>
        <ul className='space-y-1'>
          <li>
            <button
              className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                pathname === '/' ? 'bg-gray-100 text-gray-700' : ''
              }`}
              onClick={() => navigate('/')}
            >
              Overview
            </button>
          </li>

          <li>
            <details
              className='group [&_summary::-webkit-details-marker]:hidden'
              open={['/partner', '/user'].includes(pathname)}
            >
              <summary className='flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500  hover:bg-gray-100 hover:text-gray-700'>
                <span className='text-sm font-medium'>Account</span>

                <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </summary>

              <ul className='mt-2 space-y-1 px-4'>
                <li>
                  <button
                    className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                      pathname === '/partner' ? 'bg-gray-100 text-gray-700' : ''
                    }`}
                    onClick={() => navigate('/partner')}
                  >
                    Partner
                  </button>
                </li>

                <li>
                  <button
                    className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                      pathname === '/user' ? 'bg-gray-100 text-gray-700' : ''
                    }`}
                    onClick={() => navigate('/user')}
                  >
                    User
                  </button>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details
              className='group [&_summary::-webkit-details-marker]:hidden'
              open={['/reward', '/coupon', '/user-action', '/campaign', '/referral'].includes(pathname)}
            >
              <summary className='flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500  hover:bg-gray-100 hover:text-gray-700'>
                <span className='text-sm font-medium'>Loyalty</span>

                <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </summary>

              <ul className='mt-2 space-y-1 px-4'>
                <li>
                  <button
                    className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                      pathname === '/reward' ? 'bg-gray-100 text-gray-700' : ''
                    }`}
                    onClick={() => navigate('/reward')}
                  >
                    Reward
                  </button>
                </li>

                <li>
                  <button
                    className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                      pathname === '/coupon' ? 'bg-gray-100 text-gray-700' : ''
                    }`}
                    onClick={() => navigate('/coupon')}
                  >
                    Coupon
                  </button>
                </li>

                <li>
                  <button
                    className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                      pathname === '/user-action' ? 'bg-gray-100 text-gray-700' : ''
                    }`}
                    onClick={() => navigate('/user-action')}
                  >
                    User Action
                  </button>
                </li>

                <li>
                  <button
                    className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                      pathname === '/campaign' ? 'bg-gray-100 text-gray-700' : ''
                    }`}
                    onClick={() => navigate('/campaign')}
                  >
                    Campaign
                  </button>
                </li>

                <li>
                  <button
                    className={`flex rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full ${
                      pathname === '/referral' ? 'bg-gray-100 text-gray-700' : ''
                    }`}
                    onClick={() => navigate('/referral')}
                  >
                    Referral
                  </button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}
