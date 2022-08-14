import React from 'react'
import { Outlet } from 'react-router-dom'
import ModuleHeading from '../ModuleHeading'

function ClientDetails() {
  return (
    <>
        <ModuleHeading module='Client Data Module'/>
        <Outlet/>
    </>
  )
}

export default ClientDetails
