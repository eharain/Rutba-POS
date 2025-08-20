// pages/new/[name].js
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { createNewEntity } from '../../lib/pos'

export default function Home() {
    const router = useRouter()
    const { name } = router.query
    let errMessage;

    useEffect(() => {
        if (!name) return

        const createEntity = async () => {
            try {
                const res = await createNewEntity(name);
                const data = res?.data || {};
                const id = data.invoice_no ?? data.documentId ?? data.id;
                if (id) {
                    router.replace(`/${id}/${name}`)
                } else {
                    console.error("Failed to create", res)
                }
            } catch (err) {
                console.error("Error creating", err)
                errMessage = err?.response?.data?.error?.message || ("Failed to create " + name)
            }
        }

        createEntity()
    }, [name])

    return (
        <div className="p-4">
            <p>Creating new {name}...</p>
            {errMessage && <p className="text-red-500">{errMessage}</p>}
        </div>
    )
}
