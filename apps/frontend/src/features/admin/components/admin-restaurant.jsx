import React from 'react'
import { Avatar } from '@radix-ui/react-avatar'
import { SidebarProvider,SidebarTrigger } from '@/components/ui/sidebar'
import SidebarRight from './Sidebar'
//bluez
const AdminRestaurant = () => {
  return (
    <>
     <SidebarProvider>
      <SidebarRight />
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
    </>
  )
   
  
}

export default AdminRestaurant
