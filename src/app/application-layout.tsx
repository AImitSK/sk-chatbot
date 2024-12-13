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
          <div className="w-10 h-10 overflow-hidden">
            <Avatar 
              src={user.profileImage || '/users/erica.jpg'} 
              className="w-full h-full object-cover" 
              square 
              alt={`Profile picture of ${user.username}`}
            />
          </div>
          <span className="min-w-0 flex flex-col">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              {user.username}
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </span>
        </span>
        <ChevronUpIcon />
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
  let pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    // Username vom Server abrufen
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Fehler beim Abrufen der Benutzerinformationen');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUser(null);
        // Komplette Seite neu laden statt nur router.push
        window.location.href = '/login';
      } else {
        console.error('Fehler beim Ausloggen');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

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
                  onLogout={handleLogout}
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
              <SidebarItem href="/profil" current={pathname.startsWith('/profil')}>
                <Cog6ToothIcon />
                <span>Profile</span>
              </SidebarItem>
              <SidebarItem href="/rechnungen" current={pathname.startsWith('/rechnungen')}>
                <Square2StackIcon />
                <span>Rechnungen</span>
              </SidebarItem>
              <SidebarItem href="/firmenprofil" current={pathname.startsWith('/firmenprofil')}>
                <Cog6ToothIcon />
                <span>Firmenprofil</span>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="/support">
                <QuestionMarkCircleIcon />
                <span>Support</span>
              </SidebarItem>
              <UserSection user={user} onLogout={handleLogout} />
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
