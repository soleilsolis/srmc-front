import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { useEffect, useState } from 'react'

const NewUser = () => {
    const [name, setName] = useState()
    const [title, setTitle] = useState()
    const [email, setEmail] = useState()
    const [email_verified_at, setEmailVerifiedAt] = useState()
    const [password, setPassword] = useState()
    const [birthdate, setBirthdate] = useState()
    const [contact_number, setContactNumber] = useState()
    const [address, setAddress] = useState()
    const [slots, setSlots] = useState()
    const [type, setType] = useState()
    const [sex, setSex] = useState()
    return (
        <AppLayout header="New User">
            <Head>
                <title>New User - SRMC</title>
            </Head>
        </AppLayout>
    )
}

export default NewUser
