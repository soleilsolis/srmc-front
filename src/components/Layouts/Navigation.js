import { useAuth } from '@/hooks/auth'
import { useState, useEffect, createElement } from 'react'
import Link from 'next/link'

import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    IconButton,
} from '@material-tailwind/react'
import {
    ChevronDownIcon,
    Cog6ToothIcon,
    PowerIcon,
    Bars2Icon,
    ClipboardIcon,
    PresentationChartBarIcon,
    UserGroupIcon,
    ArchiveBoxIcon,
    DocumentChartBarIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

function ProfileMenu() {
    const { logout, user } = useAuth()
    const router = useRouter()

    const profileMenuItems = [
        {
            label: 'Edit Profile',
            icon: Cog6ToothIcon,
            onclick: () => router.push('/profile'),
        },
        {
            label: 'Sign Out',
            icon: PowerIcon,
            onclick: logout,
        },
    ]
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto">
                    <Avatar
                        variant="circular"
                        size="sm"
                        alt="tania andrew"
                        className="border border-gray-900 p-0.5"
                        src={
                            user && user.profile_photo_path != null
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.profile_photo_path}`
                                : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
                        }
                    />
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 transition-transform ${
                            isMenuOpen ? 'rotate-180' : ''
                        }`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                {profileMenuItems.map(({ label, icon, onclick }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1
                    return (
                        <MenuItem
                            key={label}
                            onClick={onclick}
                            className={`flex items-center gap-2 rounded ${
                                isLastItem
                                    ? 'hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10'
                                    : ''
                            }`}>
                            {createElement(icon, {
                                className: `h-4 w-4 ${
                                    isLastItem ? 'text-red-500' : ''
                                }`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal"
                                color={isLastItem ? 'red' : 'inherit'}>
                                {label}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </MenuList>
        </Menu>
    )
}

const navListItems = [
    {
        label: 'Dashboard',
        icon: PresentationChartBarIcon,
        href: '/admin/dashboard',
        type: ['admin'],
    },
    {
        label: 'Appointments',
        icon: ClipboardIcon,
        href: '/appointments',
        type: ['patient', 'doctor'],
    },

    {
        label: 'Appointments',
        icon: ClipboardIcon,
        href: '/admin/appointments',
        type: ['admin', 'staff'],
    },
    {
        label: 'Follow Up',
        icon: ClipboardIcon,
        href: '/follow',
        type: ['doctor'],
    },
    {
        label: 'Transactions',
        icon: CurrencyDollarIcon,
        href: '/admin/transactions/1',
        type: ['admin', 'staff'],
    },
    {
        label: 'Users',
        icon: UserGroupIcon,
        href: '/admin/users',
        type: ['admin'],
    },
    {
        label: 'Supply',
        icon: ArchiveBoxIcon,
        href: '/admin/supply',
        type: ['admin', 'staff'],
    },
    {
        label: 'Summary',
        icon: DocumentChartBarIcon,
        href: '/admin/summary',
        type: ['admin', 'staff'],
    },
]

function NavList(props) {
    return (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
            {navListItems
                .filter(item => {
                    return (
                        item.type.find(element => element == props.type) !==
                        undefined
                    )
                })
                .map(({ label, icon, href }) => (
                    <Link href={href} key={label}>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            <MenuItem className="flex items-center gap-2 lg:rounded-full">
                                {createElement(icon, {
                                    className: 'h-[18px] w-[18px]',
                                })}{' '}
                                {label}
                            </MenuItem>
                        </Typography>
                    </Link>
                ))}
        </ul>
    )
}

export default function Navigation() {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const { user } = useAuth()

    const toggleIsNavOpen = () => setIsNavOpen(cur => !cur)

    useEffect(() => {
        window.addEventListener(
            'resize',
            () => window.innerWidth >= 960 && setIsNavOpen(false),
        )
    }, [])

    return (
        <Navbar className="mx-auto max-w-screen-7xl p-2 mb-4 lg:pl-6">
            <div className="relative max-w-screen-3xl xl:px-16 md:px-0 mx-auto flex items-center text-blue-gray-900 ">
                <Typography
                    as="a"
                    href="/dashboard"
                    className="mr-4 ml-2 cursor-pointer py-1.5 font-medium inline-flex text-red-500 items-center gap-3 text-xl">
                    <img
                        className="h-10"
                        src="/ic_splashlogo.png"
                        alt="nature image"
                    />
                    {user && user.type === 'doctor' ? 'Doctor' : ''}
                    {user && user.type === 'admin' ? 'Admin' : ''}
                </Typography>
                <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
                    <NavList type={user ? user.type : ''} />
                </div>
                <IconButton
                    size="sm"
                    color="blue-gray"
                    variant="text"
                    onClick={toggleIsNavOpen}
                    className="ml-auto mr-2 lg:hidden">
                    <Bars2Icon className="h-6 w-6" />
                </IconButton>
                <ProfileMenu />
            </div>
            <MobileNav open={isNavOpen} className="overflow-scroll">
                <NavList type={user ? user.type : ''} />
            </MobileNav>
        </Navbar>
    )
}
