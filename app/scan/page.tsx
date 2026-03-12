"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExternalLink, ShieldCheck, Key, ArrowRightCircle } from "lucide-react"
import { toast } from "sonner"

/**
 * MOCK EXTERNAL TESTER
 * This page simulates how an external project (like a main website) 
 * would trigger the access flow to this configuration project.
 */
export default function AccessFlowTester() {
    const [username, setUsername] = useState("admin")
    const [generatedPath, setGeneratedPath] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

    const generateTestPath = async () => {
        setLoading(true)
        setGeneratedPath(null)
        try {
            const res = await fetch(`${API_URL}/api/auth/gatekeeper`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to generate path')

            setGeneratedPath(data.path)
            toast.success("Path generated successfully!")
        } catch (err) {
            const e=err as Error

            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    const testRedirect = () => {
        if (!generatedPath) return
        // Redirect to the bridge handler in this project
        window.location.href = `/access/${generatedPath}`
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4 font-sans">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

            <Card className="w-full max-w-xl bg-zinc-900 border-zinc-800 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Mock External Project</span>
                    </div>
                    <CardTitle className="text-2xl font-black italic">ACCESS FLOW TESTER</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Use this page to test the dynamic path generation and bridge redirection.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                        <div className="flex items-center gap-3 mb-2">
                            <Key className="w-5 h-5 text-indigo-400" />
                            <h3 className="font-bold text-zinc-200">1. Generate Secret Path</h3>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Admin Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-zinc-900 border-zinc-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Button
                                onClick={generateTestPath}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                            >
                                {loading ? "Generating..." : "Generate"}
                            </Button>
                        </div>
                    </div>

                    {generatedPath && (
                        <div className="space-y-4 p-4 bg-emerald-900/10 rounded-xl border border-emerald-500/20 animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <h3 className="font-bold text-emerald-400">2. Generated Ticket</h3>
                            </div>

                            <div className="bg-black/40 p-3 rounded border border-emerald-500/30 font-mono text-xs break-all text-emerald-300">
                                {generatedPath}
                            </div>

                            <Button
                                onClick={testRedirect}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 gap-2 shadow-lg shadow-emerald-950/20"
                            >
                                Test Redirect to Bridge
                                <ArrowRightCircle className="w-5 h-5" />
                            </Button>
                        </div>
                    )}

                    <div className="text-[10px] text-zinc-500 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800 font-mono leading-relaxed">
                        <p className="text-zinc-400 font-bold mb-1 uppercase tracking-tighter text-[9px]">How it works:</p>
                        1. External app calls <span className="text-zinc-200">POST /api/auth/gatekeeper</span> with username.<br />
                        2. API returns a <span className="text-zinc-200">uuid slug</span> (valid for 5 mins).<br />
                        3. External app redirects user to <span className="text-zinc-200">/access/[slug]</span>.<br />
                        4. Bridge sets cookie and redirects to <span className="text-zinc-200">/dashboard</span>.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
