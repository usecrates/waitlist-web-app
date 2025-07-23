"use client";
import { useCallback, useState } from "react";
import { usePrivyAuth } from "@/context/PrivyAuthContext";
import { useCreateKYCLink, useEnrichedUser, useHasMounted, useRegisterUser } from "@/hooks/user-hooks";

export default function OnboardingPage() {
    const { address, authenticated } = usePrivyAuth();
    const hasMounted = useHasMounted();
    const [name, setName] = useState("");
    const { data: userData, isLoading, error } = useEnrichedUser(address, authenticated);
    const { mutate, isPending, isSuccess, data } = useRegisterUser();
    const { mutate: kycMutate, isPending: kycPending, isSuccess: kycSuccess, isError, error: kycError, data: kycData } = useCreateKYCLink();

    const handleClick = (entityId: string) => {
        kycMutate(entityId);
        if (kycPending) {
            alert("KYC link is being created, please wait...");
            return;
        }
        if (isError) {
            alert(`Error creating KYC link: ${kycError.message}`);
            return;
        }
        if (kycSuccess && kycData?.kyc_res.embed_url) {
            window.open(kycData.kyc_res.embed_url, "_blank");
        } else {
            alert("KYC link created successfully, but no embed URL found.");
        }
        console.log("KYC link created successfully:", kycData);
    };

    const handleRegister = useCallback(() => {
        console.log("Registering user with address:", address, "and name:", name);
        if (!address) {
            alert("Please connect your wallet.");
            return;
        }
        if (!name) {
            alert("Please enter your name.");
            return;
        }
        mutate({
            wallet: address,
            name: name,
        });
    }, [mutate]);
    if (!hasMounted) return null; // SSR-safe: prevents hydration issues
    if (!authenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Please connect your wallet to continue.</h1>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-start justify-center gap-6 mt-32">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-300 rounded-full text-center font-bold">1</div>
                    <div className="mt-2 p-4 border rounded-md w-64 shadow-md">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full mb-2 p-2 border rounded text-black"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Wallet Address"
                            className="w-full mb-2 p-2 border rounded"
                            value={address.slice(0, 10) || ""}
                            disabled={true}
                        />
                        <button
                            className="w-full bg-green-400 p-2 rounded mt-2 hover:bg-green-400"
                            onClick={handleRegister}
                            title={isPending ? "Processing..." : isSuccess ? "Registered Successfully!" : "Click to Register"}
                        >
                            Create Entity ID
                        </button>
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center mt-6">
                    <span className="text-3xl">➡️</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-400 rounded-full text-center font-bold">2</div>
                    <div className="mt-2 p-4 border rounded-md w-64 h-40 shadow-md flex items-center justify-center">
                        <button onClick={() => {
                            if (userData?.entity_id) {
                                handleClick(userData?.entity_id);

                            } else {
                                alert("Please create an Entity ID first.");
                            }
                        }} className="bg-green-400 p-2 rounded hover:bg-green-400">
                            Complete KYC Third Party
                        </button>
                    </div>
                    {(kycSuccess && kycData?.kyc_res.embed_url)
                        && (
                            <a
                                href={kycData?.kyc_res.embed_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 cursor-pointer"
                            >
                                Complete Your KYC
                            </a>
                        )}
                </div>

                {/* Arrow */}
                <div className="flex items-center mt-6">
                    <span className="text-3xl">➡️</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-400 rounded-full text-center font-bold">3</div>
                    <div className="mt-2 p-4 border rounded-md  shadow-md flex items-end justify-center">
                        <button className="bg-green-400 p-2 rounded hover:bg-green-400">
                            Link Wallet to Dinari
                        </button>
                    </div>
                </div>
            </div>

            {userData?.wallet && <pre className="mt-6 text-sm text-white">{JSON.stringify(userData, null, 2)}</pre>}
        </>
    );
}
