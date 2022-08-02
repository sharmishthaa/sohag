import React from 'react'
import { Outlet } from 'react-router-dom'
import ModuleHeading from '../ModuleHeading'

function GS() {
  return (
    <div>
        <ModuleHeading module='Global Settings'/>
        <Outlet/>
    </div>
  )
}

export default GS
