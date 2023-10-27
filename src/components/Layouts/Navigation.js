import { useAuth } from '@/hooks/auth'
import { useState, useEffect, createElement, Fragment } from 'react'
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
    Card,
    IconButton,
} from '@material-tailwind/react'
import {
    UserCircleIcon,
    Square3Stack3DIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    InboxArrowDownIcon,
    LifebuoyIcon,
    PowerIcon,
    RocketLaunchIcon,
    Bars2Icon,
    ClipboardIcon,
    PresentationChartBarIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline'

function ProfileMenu() {
    const { logout } = useAuth()

    const profileMenuItems = [
        {
            label: 'My Profile',
            icon: UserCircleIcon,
        },
        {
            label: 'Edit Profile',
            icon: Cog6ToothIcon,
        },
        {
            label: 'Inbox',
            icon: InboxArrowDownIcon,
        },
        {
            label: 'Help',
            icon: LifebuoyIcon,
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
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
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

// nav list menu
const navListMenuItems = [
    {
        title: '@material-tailwind/html',
        description:
            'Learn how to use @material-tailwind/html, packed with rich components and widgets.',
    },
    {
        title: '@material-tailwind/react',
        description:
            'Learn how to use @material-tailwind/react, packed with rich components for React.',
    },
    {
        title: 'Material Tailwind PRO',
        description:
            'A complete set of UI Elements for building faster websites in less time.',
    },
]

function NavListMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const renderItems = navListMenuItems.map(({ title, description }) => (
        <Link href="#" key={title}>
            <MenuItem>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                    {title}
                </Typography>
                <Typography
                    variant="small"
                    color="gray"
                    className="font-normal">
                    {description}
                </Typography>
            </MenuItem>
        </Link>
    ))

    return (
        <Fragment>
            <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
                <MenuHandler>
                    <Typography
                        as="a"
                        href="#"
                        variant="small"
                        className="font-normal">
                        <MenuItem className="hidden items-center gap-2 text-blue-gray-900 lg:flex lg:rounded-full">
                            <Square3Stack3DIcon className="h-[18px] w-[18px]" />{' '}
                            Pages{' '}
                            <ChevronDownIcon
                                strokeWidth={2}
                                className={`h-3 w-3 transition-transform ${
                                    isMenuOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </MenuItem>
                    </Typography>
                </MenuHandler>
                <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
                    <Card
                        color="blue"
                        shadow={false}
                        variant="gradient"
                        className="col-span-3 grid h-full w-full place-items-center rounded-md">
                        <RocketLaunchIcon
                            strokeWidth={1}
                            className="h-28 w-28"
                        />
                    </Card>
                    <ul className="col-span-4 flex w-full flex-col gap-1">
                        {renderItems}
                    </ul>
                </MenuList>
            </Menu>
            <MenuItem className="flex items-center gap-2 text-blue-gray-900 lg:hidden">
                <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{' '}
            </MenuItem>
            <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
                {renderItems}
            </ul>
        </Fragment>
    )
}

const navListItems = [
    {
        label: 'Dashboard',
        icon: PresentationChartBarIcon,
        href: '/appointments',
        type: ['patient', 'doctor', 'admin'],
    },
    {
        label: 'Appointments',
        icon: ClipboardIcon,
        href: '/appointments',
        type: ['patient', 'doctor'],
    },
    {
        label: 'Follow Up',
        icon: ClipboardIcon,
        href: '/follow',
        type: ['doctor'],
    },
    {
        label: 'Users',
        icon: UserGroupIcon,
        href: '/admin/users',
        type: ['admin'],
    },
]

function NavList(props) {
    return (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
            <NavListMenu />
            {navListItems
                .filter(item => {
                    return (
                        item.type.find(element => element == props.type) !==
                        undefined
                    )
                })
                .map(({ label, icon, href }) => (
                    <Typography
                        key={label}
                        as="a"
                        href={href}
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
        <Navbar className="mx-auto max-w-screen-7xl p-2 mb-4 lg:rounded-full lg:pl-6">
            <div className="relative max-w-screen-3xl xl:px-16 md:px-0 mx-auto flex items-center text-blue-gray-900 ">
                <Typography
                    as="a"
                    href="#"
                    className="mr-4 ml-2 cursor-pointer py-1.5 font-medium inline-flex text-red-500 items-center gap-3 text-xl">
                    <img
                        className="h-10"
                        src="/ic_splashlogo.png"
                        alt="nature image"
                    />
                    {user && user.type === 'doctor' ? 'Doctor' : ''}
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
