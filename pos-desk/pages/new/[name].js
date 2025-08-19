// pages/new/[name].js
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { authApi } from '../../lib/api'  // assuming api.js is in lib/

export default function Home() {
	const router = useRouter()
	const { name } = router.query
	let errMessage;

	const defaultNew = {
		sales: () => ({
			invoice_no: 'INV-' + Date.now(),
			sale_date: new Date().toISOString(),
			total: 0,
			users: {
				connect: [authApi.getUser().id],
				disconnect: [],
			},
		}),
	}

	useEffect(() => {
		if (!name) return

		const createEntity = async () => {
			try {
				const data = typeof defaultNew[name] === "function" ? defaultNew[name]() : {}

				const res = await authApi.post(`/${name}`, { data });

				const id = res?.data?.id ?? res?.data?.data?.id
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
