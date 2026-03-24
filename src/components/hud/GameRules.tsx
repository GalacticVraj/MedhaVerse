"use client";
import { Shield, Zap, MousePointer2, Info, CheckCircle2 } from "lucide-react";

interface GameRulesProps {
    onStart: () => void;
}

export default function GameRules({ onStart }: GameRulesProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-black/80 border border-cyan-500/40 w-full max-w-lg rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(0,224,255,0.2)] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 text-center border-b border-white/5">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-400/30">
                        <Shield className="text-cyan-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Engineering Protocol</h2>
                    <p className="text-cyan-300/60 text-xs font-mono tracking-widest mt-1">OPERATIONAL GUIDELINES v1.0.4</p>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
                                <MousePointer2 size={18} className="text-white/60" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">INTERACT</h3>
                                <p className="text-xs text-white/40 leading-relaxed">Click on any traffic signal in the 3D view to open its control panel.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
                                <Zap size={18} className="text-orange-400/80" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">CONFIGURE</h3>
                                <p className="text-xs text-white/40 leading-relaxed">Adjust green and red phases to keep traffic flowing. Watch for "Gridlock" on the HUD.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
                                <CheckCircle2 size={18} className="text-emerald-400/80" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">SAFETY FIRST</h3>
                                <p className="text-xs text-white/40 leading-relaxed">Vehicles will automatically stop if they get too close to one another to prevent accidents.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 flex gap-3">
                        <Info size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-cyan-200/60 leading-relaxed italic">
                            Tip: Emergency vehicles ignore red lights, but they can still be blocked by heavy traffic. Clear a path!
                        </p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={onStart}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(0,224,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        INITIALIZE CONTROL SYSTEM
                    </button>
                </div>
            </div>
        </div>
    );
}
