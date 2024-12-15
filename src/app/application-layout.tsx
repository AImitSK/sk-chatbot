'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { getEvents } from '@/data'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  username: string;
  email: string;
  role: string;
  profileImage: string | null;
}

function AccountDropdownMenu({ anchor, onLogout, user }: {
  anchor: 'top start' | 'bottom end',
  onLogout: () => void,
  user: UserData
}) {
  return (
      <DropdownMenu className="min-w-64" anchor={anchor}>
        <DropdownItem onClick={() => window.location.href = '/userprofil'}>
          <UserCircleIcon />
          <span>Userprofil</span>
        </DropdownItem>
        <DropdownItem onClick={onLogout}>
          <ArrowRightStartOnRectangleIcon />
          <span>Sign out</span>
        </DropdownItem>
      </DropdownMenu>
  )
}

function UserSection({ user, onLogout }: { user: UserData | null, onLogout: () => void }) {
  if (!user) {
    return (
      <SidebarItem href="/login">
        <ArrowRightEndOnRectangleIcon />
        <span>Sign in</span>
      </SidebarItem>
    );
  }

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <span className="flex min-w-0 items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <Avatar 
              src={user.profileImage || '/default-avatar.png'} 
              className="w-full h-full object-cover" 
              alt={`Profile picture of ${user.username}`}
            />
          </div>
          <span className="min-w-0 flex flex-col">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              {user.username}
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              {user.email || 'No email provided'}
            </span>
          </span>
          <ChevronUpIcon className="h-5 w-5 flex-none text-zinc-400" />
        </span>
      </DropdownButton>
      <AccountDropdownMenu 
        anchor="top start" 
        onLogout={onLogout}
        user={user}
      />
    </Dropdown>
  );
}

export function ApplicationLayout({
  events,
  children,
}: {
  events: Awaited<ReturnType<typeof getEvents>>
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth();

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            {user ? (
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 overflow-hidden">
                      <Avatar 
                        src={user.profileImage || '/users/erica.jpg'} 
                        className="w-full h-full object-cover"
                        square 
                        alt={`Profile picture of ${user.username}`}
                      />
                    </div>
                    <span className="ml-2 flex flex-col">
                      <span className="text-sm font-medium">{user.username}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </span>
                  </div>
                </DropdownButton>
                <AccountDropdownMenu 
                  anchor="bottom end" 
                  onLogout={logout}
                  user={user}
                />
              </Dropdown>
            ) : (
              <NavbarItem href="/login">
                <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                <span>Sign in</span>
              </NavbarItem>
            )}
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Image
              src="/logo-sk-online-marketing.svg"
              alt="Logo"
              width={50}
              height={50}
              style={{ width: '120px', height: '50px' }}
            />
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarItem>
              <SidebarItem href="/integration" current={pathname.startsWith('/integration')}>
                <SparklesIcon />
                <span>Integration</span>
              </SidebarItem><SidebarItem href="/conversations" current={pathname.startsWith('/conversations')}>
              <Square2StackIcon />
              <span>Conversations</span>
            </SidebarItem>
              <SidebarItem href="/firmenprofil" current={pathname.startsWith('/firmenprofil')}>
                <Cog6ToothIcon />
                <span>Firmenprofil</span>
              </SidebarItem>
                <SidebarItem href="/vertragsmodell" current={pathname.startsWith('/vertragsmodell')}>
                  <ShieldCheckIcon />
                  <span>Vertragsmodell</span>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="/support">
                <QuestionMarkCircleIcon />
                <span>Support</span>
              </SidebarItem>
              <UserSection user={user} onLogout={logout} />
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
