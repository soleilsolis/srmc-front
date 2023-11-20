import { EyeIcon } from '@heroicons/react/24/solid'
import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    IconButton,
    Tooltip,
    Input,
} from '@material-tailwind/react'

import { useTransaction } from '@/hooks/transaction'

import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'

const TABLE_HEAD = [
    '',
    'Product/Service',
    'Account',
    'Amount',
    'Date',
    'Status',
    'Actions',
]

const Transactions = () => {
    const router = useRouter()
    const page = router.query.slug
    const { transactionsQuery } = useTransaction()
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        typeof page !== 'undefined' &&
            transactionsQuery({ type: page }).then(res =>
                setTransactions(res.data.data),
            )
    }, [page])

    return (
        <AppLayout>
            <Head>
                <title>Transactions - SRMC</title>
            </Head>
            <Card className="h-full w-full mb-10">
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none">
                    <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Recent Transactions
                            </Typography>
                            <Typography
                                color="gray"
                                className="mt-1 font-normal">
                                These are details about the last transactions
                            </Typography>
                        </div>
                        <div className="flex w-full shrink-0 gap-2 md:w-max">
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    icon={
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    }
                                />
                            </div>
                            <Button
                                className="flex items-center gap-3"
                                size="sm">
                                <ArrowDownTrayIcon
                                    strokeWidth={2}
                                    className="h-4 w-4"
                                />{' '}
                                Download
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0">
                    <table className="w-full min-w-max table-auto text-left">
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
                            {transactions.map(
                                (
                                    {
                                        id,
                                        transactionable,
                                        amount,
                                        created_at,
                                        verified_at,
                                    },
                                    index,
                                ) => {
                                    const isLast =
                                        index === transactions.length - 1
                                    const classes = isLast
                                        ? 'p-4'
                                        : 'p-4 border-b border-blue-gray-50'

                                    return (
                                        <tr key={index}>
                                            <td className={classes}>{id}</td>
                                            <td className={classes}>
                                                {
                                                    transactionable.doctor
                                                        .service.name
                                                }
                                            </td>
                                            <td className={classes}>
                                                {transactionable.patient.name}
                                            </td>
                                            <td className={classes}>
                                                {amount}
                                            </td>
                                            <td className={classes}>
                                                {moment(created_at).format(
                                                    'MMMM Do, YYYY h:mm A',
                                                )}
                                            </td>
                                            <td className={classes}>
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-max"
                                                    value={
                                                        verified_at
                                                            ? 'Verified'
                                                            : 'Unverified'
                                                    }
                                                    color={
                                                        verified_at
                                                            ? 'green'
                                                            : 'blue-gray'
                                                    }
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="View Summary">
                                                    <IconButton variant="text">
                                                        <EyeIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    )
                                },
                            )}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Button variant="outlined" size="sm">
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        <IconButton variant="outlined" size="sm">
                            1
                        </IconButton>
                        <IconButton variant="text" size="sm">
                            2
                        </IconButton>
                        <IconButton variant="text" size="sm">
                            3
                        </IconButton>
                        <IconButton variant="text" size="sm">
                            ...
                        </IconButton>
                        <IconButton variant="text" size="sm">
                            8
                        </IconButton>
                        <IconButton variant="text" size="sm">
                            9
                        </IconButton>
                        <IconButton variant="text" size="sm">
                            10
                        </IconButton>
                    </div>
                    <Button variant="outlined" size="sm">
                        Next
                    </Button>
                </CardFooter>
            </Card>
        </AppLayout>
    )
}

export default Transactions
