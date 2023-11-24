import AppLayout from '@/components/Layouts/AppLayout'
import { useSupply } from '@/hooks/supply'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    TabsHeader,
    Tabs,
    Tab,
    CardFooter,
    Tooltip,
    IconButton,
} from '@material-tailwind/react'

import moment from 'moment'
import {
    UserPlusIcon,
    EyeIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

const TABS = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Out-of-Stock',
        value: 'outOfStock',
    },
    {
        label: 'Expired',
        value: 'expired',
    },
    {
        label: 'Vaccine',
        value: 'type/1',
    },
    {
        label: 'Medical Supplies',
        value: 'type/2',
    },
]

const TABLE_HEAD = [
    '',
    'Item Type',
    'Category',
    'Unit',
    'Cost',
    'Quantity',
    'Remaining',
    'Expiration Date',
    'Actions',
]

const Supply = () => {
    useAuth({
        middleware: 'auth',
        type: ['admin', 'staff'],
    })

    const { indexSupplies } = useSupply()
    const [supplies, setSupplies] = useState([])

    const getSupplies = type => {
        indexSupplies({ type, setSupplies })
    }

    useEffect(() => {
        getSupplies('all')
    }, [])

    return (
        <AppLayout>
            <Head>
                <title>Supplies - SRMC</title>
            </Head>

            <div className="md:px-0 px-2 pb-10">
                <Card className="h-full w-full">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        className="rounded-none">
                        <div className="mb-8 flex items-center justify-between gap-8">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Supplies list
                                </Typography>
                                <Typography
                                    color="gray"
                                    className="mt-1 font-normal">
                                    See information about all Supplies
                                </Typography>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <Link href="/admin/supply/new">
                                    <Button
                                        className="flex items-center gap-3"
                                        size="sm">
                                        <UserPlusIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />{' '}
                                        New Supply
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <Tabs value="all" className="w-full md:w-[800px]">
                                <TabsHeader>
                                    {TABS.map(({ label, value }) => (
                                        <Tab
                                            key={value}
                                            value={value}
                                            onClick={() => getSupplies(value)}>
                                            {label}
                                        </Tab>
                                    ))}
                                </TabsHeader>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-scroll px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map(head => (
                                        <th
                                            key={head}
                                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70">
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {supplies.map(
                                    (
                                        {
                                            id,
                                            name,
                                            category,
                                            unit,
                                            cost,
                                            quantity,
                                            deducted,
                                            expires_at,
                                        },
                                        index,
                                    ) => {
                                        const isLast =
                                            index === supplies.length - 1
                                        const classes = isLast
                                            ? 'p-4'
                                            : 'p-4 border-b border-blue-gray-50'

                                        return (
                                            <tr key={id}>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal">
                                                        #{id}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {name}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    {category.name}
                                                </td>
                                                <td className={classes}>
                                                    {unit}
                                                </td>
                                                <td className={classes}>
                                                    {cost}
                                                </td>
                                                <td className={classes}>
                                                    {quantity}
                                                </td>
                                                <td className={classes}>
                                                    {quantity - deducted <=
                                                    10 ? (
                                                        <span className="text-red-500 flex">
                                                            {quantity -
                                                                deducted}
                                                            <ExclamationTriangleIcon className="w-4 h-4"></ExclamationTriangleIcon>
                                                        </span>
                                                    ) : (
                                                        quantity - deducted
                                                    )}
                                                </td>
                                                <td className={classes}>
                                                    {moment(expires_at).format(
                                                        'MMM Do, YYYY',
                                                    )}{' '}
                                                    <br />
                                                </td>

                                                <td className={classes}>
                                                    <Link
                                                        href={`/admin/supply/edit/${id}`}>
                                                        <Tooltip content="View Supply">
                                                            <IconButton variant="text">
                                                                <EyeIcon className="h-4 w-4" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    },
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            Page 1 of 10
                        </Typography>
                        <div className="flex gap-2">
                            <Button variant="outlined" size="sm">
                                Previous
                            </Button>
                            <Button variant="outlined" size="sm">
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    )
}

export default Supply
