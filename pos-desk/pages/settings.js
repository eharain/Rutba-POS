import { useState, useEffect } from "react";
import PermissionCheck from "../components/PermissionCheck";
import { authApi } from "../lib/api";
import Layout from "../components/Layout";
export default function SettingsPage() {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedDesk, setSelectedDesk] = useState(null);

    useEffect(() => {
        authApi.fetch("/branches?populate=desks")
            .then(data => {
                console.log("Branches fetched:", data);

                setBranches(data.data)
            }
            );
    }, []);

    return (
        <PermissionCheck required="api::branch.branch.find">
            <Layout>
                <div className="p-4">
                    <h1 className="text-xl font-bold mb-4">POS Settings</h1>

                    {/* Branch dropdown */}
                    <label className="block mb-2 font-semibold">Select Branch</label>
                    <select
                        value={selectedBranch || ""}
                        onChange={(e) => {
                            setSelectedBranch(e.target.value);
                            setSelectedDesk(null); // reset desk on branch change
                        }}
                        className="border rounded p-2 mb-4 w-full"
                    >
                        <option value="">-- Choose Branch --</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>

                    {/* Sales Desk dropdown (depends on branch) */}
                    {selectedBranch && (
                        <>
                            <label className="block mb-2 font-semibold">Select Sales Desk</label>
                            <select
                                value={selectedDesk || ""}
                                onChange={(e) => setSelectedDesk(e.target.value)}
                                className="border rounded p-2 w-full"
                            >
                                <option value="">-- Choose Sales Desk --</option>
                                {branches
                                    .find(b => b.id === parseInt(selectedBranch))
                                    ?.desks.map((desk, idx) => (
                                        <option key={idx} value={desk.name}>
                                            {desk.name} ({desk.invoice_prefix})
                                        </option>
                                    ))}
                            </select>
                        </>
                    )}

                    {/* Save button */}
                    <button
                        onClick={() => {
                            localStorage.setItem("branch", selectedBranch);
                            localStorage.setItem("salesDesk", selectedDesk);
                            alert("Settings saved ✅");
                        }}
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={!selectedBranch || !selectedDesk}
                    >
                        Save Settings
                    </button>
                </div>
            </Layout>
        </PermissionCheck>
    );
}
