import React from 'react'
import { Outlet } from 'react-router-dom'
import ModuleHeading from '../ModuleHeading'

function ClientDetails() {
  return (
    <div>
        <ModuleHeading module='Client Data Module'/>
        <Outlet/>
    </div>
  )
}

export default ClientDetails
