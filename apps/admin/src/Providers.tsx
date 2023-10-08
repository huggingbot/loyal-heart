import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ModalProvider } from './contexts/ModalContext'

const queryClient = new QueryClient()

const Providers = ({ children }: React.PropsWithChildren): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>{children}</ModalProvider>
    </QueryClientProvider>
  )
}

export default Providers
