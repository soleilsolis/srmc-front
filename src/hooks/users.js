import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

export const useUsers = () => {
    const router = useRouter()

    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const usersQuery = async ({ ...props } = {}) => {
        await csrf()
        return axios.get(`/api/users/query/${props.type}/1`, config)
    }

    const getUser = async ({
        setUser,
        setName,
        setTitle,
        setEmail,
        setPassword,
        setBirthdate,
        setContactNumber,
        setAddress,
        setType,
        setSex,
        ...props
    } = {}) => {
        await csrf()
        return axios.get(`/api/user/${props.id}`, config).then(res => {
            setUser(res.data.data)
            setContactNumber(res.data.data.contact_number)
            setName(res.data.data.name)
            setTitle(res.data.data.title)
            setEmail(res.data.data.email)
            setPassword(res.data.data.password)
            setBirthdate(res.data.data.birthdate)
            setContactNumber(res.data.data.contact_number)
            setAddress(res.data.data.address)
            setType(res.data.data.type)
            setSex(res.data.data.sex)
        })
    }

    const newUser = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .post(`/api/users`, props, config)
            .then(() => router.push(`/admin/users`))
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }
    const editUser = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .put(`/api/user/${props.id}`, props, config)
            .then(() => router.push(`/admin/users`))
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    return {
        usersQuery,
        newUser,
        getUser,
        editUser,
    }
}
