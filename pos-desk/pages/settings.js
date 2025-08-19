import React, { useEffect, useState } from "react";
import { authApi } from "../lib/api";
import Layout from "../components/Layout";
import PermissionCheck from "../components/PermissionCheck";

export default function SettingsPage() {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedDesk, setSelectedDesk] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authApi.get("/branches?populate=desks");
                setBranches(response.data || []);

                const savedBranch = localStorage.getItem("branch");
                const savedDesk = localStorage.getItem("branch-desk");
                if (savedBranch) setSelectedBranch(JSON.parse(savedBranch));
                if (savedDesk) setSelectedDesk(JSON.parse(savedDesk));
            } catch (error) {
                console.error("Failed to fetch branches:", error);
            }
        };
        fetchData();
    }, []);

    const handleDeskSelect = (branch, desk) => {
        setSelectedBranch(branch);
        setSelectedDesk(desk);
        localStorage.setItem("branch", JSON.stringify(branch));
        localStorage.setItem("branch-desk", JSON.stringify(desk));
    };

    return (
        <PermissionCheck required="api::branch.branch.find">
            <Layout>
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4">Settings</h1>

                    <div className="space-y-6">
                        <h2>Please select the Branch and Desk for this POS</h2>
                        {branches.map((branch) => (
                            <div key={branch.id} className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-1">{branch.name}</h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    Select a desk below to set your default POS branch and desk.
                                </p>
                                <ul className="space-y-2">
                                    {branch.desks.map((desk) => {
                                        const isSelected =
                                            selectedDesk?.id === desk.id && selectedBranch?.id === branch.id;

                                        return (
                                            <li key={desk.id}>
                                                <button
                                                    className={`flex justify-between items-center px-4 py-2 rounded border w-full text-left transition ${isSelected
                                                        ? "bg-blue-500 text-white border-blue-600 font-semibold"
                                                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                                                        }`}
                                                    onClick={() => handleDeskSelect(branch, desk)}
                                                >
                                                    <span>{desk.name}</span>
                                                    {isSelected && (
                                                        <span className="ml-2 font-bold">✓</span>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}

                    </div>
                </div>
            </Layout>
        </PermissionCheck>
    );
}
