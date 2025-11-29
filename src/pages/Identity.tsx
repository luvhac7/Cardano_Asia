import { useState } from "react";
import { zkIdentity, VerifiableCredential, ZKProof } from "@/lib/zkIdentity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, FileCheck, UserCheck, Lock, ArrowRight, CheckCircle2, Loader2, Fingerprint } from "lucide-react";
import { toast } from "sonner";

const Identity = () => {
    // State
    const [birthDate, setBirthDate] = useState("2000-01-01");
    const [credential, setCredential] = useState<VerifiableCredential | null>(null);
    const [proof, setProof] = useState<ZKProof | null>(null);
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

    // Loading States
    const [isIssuing, setIsIssuing] = useState(false);
    const [isProving, setIsProving] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // 1. Issue Credential
    const handleIssue = async () => {
        setIsIssuing(true);
        try {
            const cred = await zkIdentity.issueCredential("Nebula Gov", "did:nebula:user:123", [
                { name: "birthDate", value: birthDate, type: "date" }
            ]);
            setCredential(cred);
            toast.success("Verifiable Credential Issued!");
        } catch (error) {
            toast.error("Issuance failed");
        } finally {
            setIsIssuing(false);
        }
    };

    // 2. Generate Proof
    const handleProve = async () => {
        if (!credential) return;
        setIsProving(true);
        try {
            const userAge = new Date().getFullYear() - new Date(birthDate).getFullYear();
            const zkp = await zkIdentity.generateProof(
                credential,
                "birthDate",
                (val) => {
                    const age = new Date().getFullYear() - new Date(val).getFullYear();
                    return age >= 18;
                },
                "Age >= 18"
            );
            setProof(zkp);
            toast.success("ZK Proof Generated!");
        } catch (error) {
            toast.error("Proof generation failed. Requirement not met.");
        } finally {
            setIsProving(false);
        }
    };

    // 3. Verify Proof
    const handleVerify = async () => {
        if (!proof) return;
        setIsVerifying(true);
        try {
            const isValid = await zkIdentity.verifyProof(proof);
            setVerificationResult(isValid);
            if (isValid) toast.success("Access Granted!");
            else toast.error("Access Denied");
        } catch (error) {
            toast.error("Verification failed");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Fingerprint className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
                            Nebula ID
                        </h1>
                        <p className="text-slate-400">Privacy-Enhancing Identity Tools (SSI & ZKPs)</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span>Triangle of Trust Architecture</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                {/* Connecting Lines (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 left-[30%] w-[10%] h-[2px] bg-gradient-to-r from-indigo-500/50 to-transparent" />
                <div className="hidden lg:block absolute top-1/2 right-[30%] w-[10%] h-[2px] bg-gradient-to-r from-transparent to-emerald-500/50" />

                {/* COLUMN 1: ISSUER */}
                <Card className="border-indigo-500/20 bg-slate-900/50 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-50" />
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                            <Key className="w-6 h-6 text-indigo-400" />
                        </div>
                        <CardTitle className="text-white">1. Issuer</CardTitle>
                        <CardDescription>Government or Trusted Entity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                            <label className="text-xs text-slate-400 mb-2 block">Identity Attribute (Private)</label>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="bg-slate-950 border-slate-800"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleIssue}
                            disabled={isIssuing || !!credential}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isIssuing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileCheck className="w-4 h-4 mr-2" />}
                            Issue Credential
                        </Button>

                        {credential && (
                            <div className="text-xs text-center text-green-400 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Credential Sent to Wallet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* COLUMN 2: HOLDER */}
                <Card className={`border-purple-500/20 bg-slate-900/50 backdrop-blur-md relative overflow-hidden transition-all ${credential ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-purple-400" />
                        </div>
                        <CardTitle className="text-white">2. Holder (You)</CardTitle>
                        <CardDescription>Your Digital Wallet</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {credential ? (
                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-purple-300">VERIFIABLE CREDENTIAL</span>
                                    <Badge variant="outline" className="text-[10px] border-purple-500/50 text-purple-300">Signed</Badge>
                                </div>
                                <div className="text-sm text-white font-mono mb-1">Type: BirthDate</div>
                                <div className="text-xs text-slate-400 truncate">Sig: {credential.signature}</div>
                            </div>
                        ) : (
                            <div className="h-24 flex items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-lg">
                                Waiting for credential...
                            </div>
                        )}

                        <Button
                            onClick={handleProve}
                            disabled={!credential || isProving || !!proof}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            {isProving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                            Generate ZK Proof
                        </Button>

                        <p className="text-[10px] text-center text-slate-500">
                            Proves "Age {'>'}= 18" without revealing date.
                        </p>
                    </CardContent>
                </Card>

                {/* COLUMN 3: VERIFIER */}
                <Card className={`border-emerald-500/20 bg-slate-900/50 backdrop-blur-md relative overflow-hidden transition-all ${proof ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50" />
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <UserCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                        <CardTitle className="text-white">3. Verifier</CardTitle>
                        <CardDescription>Service Provider / App</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {proof ? (
                            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-emerald-300">ZERO-KNOWLEDGE PROOF</span>
                                </div>
                                <div className="text-xs text-slate-400 font-mono break-all">
                                    Hash: {proof.proofHash.substring(0, 20)}...
                                </div>
                                <div className="mt-2 text-xs text-white">
                                    Predicate: <span className="font-bold">{proof.predicate}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-24 flex items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-lg">
                                Waiting for proof...
                            </div>
                        )}

                        <Button
                            onClick={handleVerify}
                            disabled={!proof || isVerifying || verificationResult !== null}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Verify Proof
                        </Button>

                        {verificationResult === true && (
                            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
                                <span className="text-green-400 font-bold flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> ACCESS GRANTED
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Identity;
