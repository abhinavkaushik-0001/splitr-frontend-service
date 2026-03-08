import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
function HeaderWrapper() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
export default HeaderWrapper