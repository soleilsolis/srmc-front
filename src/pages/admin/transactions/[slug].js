import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Chip,
} from '@material-tailwind/react'

import { useTransaction } from '@/hooks/transaction'

import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { useAuth } from '@/hooks/auth'

const TABLE_HEAD = [
    '',
    'Product/Service',
    'Account',
    'Amount',
    'Date',
    'Status',
]

const Transactions = () => {
    useAuth({
        middleware: 'auth',
        type: ['admin', 'staff'],
    })

    const router = useRouter()
    const page = router.query.slug
    const { transactionsQuery } = useTransaction()
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        if (typeof page !== 'undefined')
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
                                                        verified_at !== null
                                                            ? 'Verified'
                                                            : 'Unverified'
                                                    }
                                                    color={
                                                        verified_at !== null
                                                            ? 'green'
                                                            : 'blue-gray'
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )
                                },
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </AppLayout>
    )
}

export default Transactions
