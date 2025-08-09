'use client'

import { usePathname, useRouter } from 'next/navigation'
import { HomeIcon, CalendarIcon, PlusIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeIconSolid, CalendarIcon as CalendarIconSolid, UsersIcon as UsersIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import { useHaptics } from '@/hooks/useMobile'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  activeIcon: React.ComponentType<{ className?: string }>
  isSpecial?: boolean
}

const navigationItems: NavItem[] = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    name: 'Habits',
    href: '/habits',
    icon: CalendarIcon,
    activeIcon: CalendarIconSolid,
  },
  {
    name: 'Add',
    href: '/habits/create',
    icon: PlusIcon,
    activeIcon: PlusIcon,
    isSpecial: true,
  },
  {
    name: 'Social',
    href: '/social',
    icon: UsersIcon,
    activeIcon: UsersIconSolid,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    activeIcon: UserIconSolid,
  },
]

export default function MobileNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { lightImpact } = useHaptics()

  const handleNavigation = (href: string) => {
    lightImpact()
    router.push(href)
  }

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/')
          const IconComponent = isActive ? item.activeIcon : item.icon

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 transition-all duration-200 haptic-feedback',
                item.isSpecial
                  ? 'relative'
                  : isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {item.isSpecial ? (
                <div className="bg-primary-600 rounded-full p-3 shadow-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              ) : (
                <IconComponent className="w-6 h-6" />
              )}
              
              {!item.isSpecial && (
                <span className="text-xs font-medium">{item.name}</span>
              )}

              {/* Active indicator */}
              {isActive && !item.isSpecial && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
