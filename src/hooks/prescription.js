import axios from '@/lib/axios'
import { Alert } from '@material-tailwind/react'
export const usePrescription = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const newPrescription = async ({
        setErrors,
        prescriptions,
        handleOpen,
        ...props
    }) => {
        await csrf()

        axios
            .post(`/api/prescription/appointment/${props.id}`, props, config)
            .then(res => {
                prescriptions.push(res.data.data)
                handleOpen()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const deletePrescription = async ({
        setErrors,
        prescriptions,
        setPrescriptions,
        handleRemoveOpen,
        ...props
    }) => {
        await csrf()

        axios
            .delete(`/api/prescription/${props.id}`, props, config)
            .then(() => {
                setPrescriptions(
                    prescriptions.filter(
                        prescription => prescription.id !== props.id,
                    ),
                )
                handleRemoveOpen()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const sendPrescription = async ({ setErrors, setAlertz, ...props }) => {
        await csrf()
        axios
            .post(`/api/appointment/prescriptions/send/${props.id}`, config)
            .then(() => {
                setAlertz(
                    <Alert
                        color="green"
                        className="mt-5"
                        onClick={() => setAlertz()}>
                        Email sent to patient.
                    </Alert>,
                )
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    return {
        newPrescription,
        deletePrescription,
        sendPrescription,
    }
}
