import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../Layout'
import Scope from '../component/Scope'
import ClientSetting from '../component/clientSetting'
import Config from '../component/Config'

export default function AdminRoute() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Config />} />
        <Route path="config" element={<Config />} />
        <Route path="clientSettings" element={<ClientSetting />} />
        <Route path="scope" element={<Scope />} />
      </Route>
    </Routes>
  )
}
