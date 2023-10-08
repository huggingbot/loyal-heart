import { BrowserRouter as Router, Route, Routes as ReactRouterRoutes } from 'react-router-dom'

import { Campaign } from './pages/Campaign'
import { Coupon } from './pages/Coupon'
import { Overview } from './pages/Overview'
import { Partner } from './pages/Partner'
import { Referral } from './pages/Referral'
import { Reward } from './pages/Reward'
import { User } from './pages/User'
import { UserAction } from './pages/UserAction'

const Routes = (): JSX.Element => {
  return (
    <Router>
      <ReactRouterRoutes>
        <Route path='/' element={<Overview />} />
        <Route path='/partner' element={<Partner />} />
        <Route path='/user' element={<User />} />
        <Route path='/reward' element={<Reward />} />
        <Route path='/coupon' element={<Coupon />} />
        <Route path='/user-action' element={<UserAction />} />
        <Route path='/campaign' element={<Campaign />} />
        <Route path='/referral' element={<Referral />} />
      </ReactRouterRoutes>
    </Router>
  )
}

export default Routes
