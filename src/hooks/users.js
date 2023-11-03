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

    const getUser = async ({ setUser, ...props } = {}) => {
        await csrf()
        return axios
            .get(`/api/user/${props.id}`, config)
            .then(res => setUser(res.data.data))
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

    return {
        usersQuery,
        newUser,
        getUser,
    }
}
