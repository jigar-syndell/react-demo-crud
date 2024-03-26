import React from 'react'
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'))
const UpdatePassword = React.lazy(() => import('./components/changePassword/UpdatePassword'))
const ResetPassword = React.lazy(() => import('./components/resetPassword/ResetPassword'))
const Users = React.lazy(() => import('./components/masters/Users'))
const Items = React.lazy(() => import('./components/masters/Items'))
const Test = React.lazy(() => import('./components/masters/Test'))
const CreateItem = React.lazy(() => import('./components/masters/CreateItem'))
const EditItem = React.lazy(() => import('./components/masters/Edititem'))
const ItemGroup = React.lazy(() => import('./components/masters/ItemGroup'))
const PicklistType = React.lazy(() => import('./components/masters/PicklistType'))
const Profile = React.lazy(() => import('./components/profile/Profile'))
const PicklistValue = React.lazy(() => import('./components/masters/PicklistValue'))

const routes = [
    { path: '/', exact: true, name: 'Login' },
    { path: '/home', name: 'Dashboard', element: Dashboard },
    { path: '/changepassword', name: 'Change Password', element: UpdatePassword },
    { path: '/resetpassword', name: 'Reset Password', element: ResetPassword },
    { path: '/users', name: 'User List', element: Users },
    { path: '/item', name: 'Items', element: Items },
    { path: '/test', name: 'Test', element: Test },
    { path: '/user-edit/:id', name: 'User Entry', element: Profile },
    { path: '/itemGroup', name: 'Item Groups', element: ItemGroup },
    { path: '/pickListValue', name: 'Pick List Values', element: PicklistValue },
    { path: '/pickListType', name: 'Pick List Type', element: PicklistType },
    { path: '/item/create', name: 'Create Item', element: CreateItem },
    { path: '/item/edit/:id', name: 'Edit Item', element: EditItem },
]


export default routes