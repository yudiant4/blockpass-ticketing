'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Zap } from 'lucide-react';

interface EventDayTicketProps {
  tokenId: string | number;
  contractAddress: string;
  ownerAddress: string;
  tier: string;
  tierData: {
    accent: string;
    glow: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
  perks: string[];
  status: 'UNUSED' | 'USED';
}

export default function EventDayTicket({
  tokenId,
  contractAddress,
  ownerAddress,
  tier,
  tierData,
  perks,
  status,
}: EventDayTicketProps) {
  const [ticketStatus, setTicketStatus] = useState<'UNUSED' | 'USED'>(status);
  const [isPerkClaimed, setIsPerkClaimed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Generate QR data based on contract, token, and owner
  const qrData = `${contractAddress}-${tokenId}-${ownerAddress}`;

  // Scan animation
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isScanning]);

  // Handler for scanning QR at gate (simulate)
  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setTicketStatus('USED');
    setIsScanning(false);
  };

  // Handler for claiming perks
  const handleClaim = () => {
    setIsPerkClaimed(true);
  };

  const { border, glow, badgeBg, badgeText } = tierData;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 flex flex-col items-center justify-center gap-6">
      {/* Header with status badge */}
      <div className="w-full max-w-md flex justify-between items-center">
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest">
          Event Day Ticket
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            ticketStatus === 'UNUSED'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-600/20 text-slate-400 border border-slate-600'
          }`}
        >
          {ticketStatus}
        </span>
      </div>

      {/* QR Code Section (only show if UNUSED) */}
      {ticketStatus === 'UNUSED' && !isScanning && (
        <div className="flex items-center justify-center w-full">
          {/* QR Container with dramatic effects */}
          <div className="relative w-[280px] h-[280px]">
            {/* Outer glow ring */}
            <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-xl animate-pulse" style={{ animationDuration: '2s' }} />
            {/* Middle ring */}
            <div className="absolute inset-4 border border-cyan-500/20 rounded-xl" />
            {/* Inner container */}
            <div className="relative w-full h-full bg-slate-900/80 border border-cyan-500/40 rounded-xl p-4 backdrop-blur-xl overflow-hidden">
              {/* Corner brackets - top-left */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
              {/* Corner brackets - top-right */}
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
              {/* Corner brackets - bottom-left */}
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
              {/* Corner brackets - bottom-right */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />
              
              {/* Scan line animation */}
              <div 
                className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-scan-line"
                style={{ animationDuration: '2s' }}
              />
              
              {/* QR Code */}
              <div className="absolute inset-4 flex items-center justify-center">
                <QRCodeSVG
                  value={qrData}
                  size={240}
                  bgColor="transparent"
                  fgColor="#00FFA3"
                  level="Q"
                  includeMargin={false}
                />
              </div>
              
              {/* Decorative center overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Zap className="h-10 w-10 text-cyan-400/30" />
              </div>
            </div>
            
            {/* Scan progress indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="font-mono text-xs text-cyan-400/70 uppercase tracking-widest">
                GATE PASS READY
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Animation Overlay */}
      {isScanning && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="relative w-[280px] h-[280px]">
            <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[240px] h-[240px] bg-slate-900/80 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
                  <p className="font-mono text-sm text-cyan-400 uppercase tracking-widest">SCANNING...</p>
                  <div className="mt-6 w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 font-mono text-xs text-slate-400">{scanProgress}%</p>
                </div>
              </div>
            </div>
            {/* Rotating scan rings */}
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-xl animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 border border-emerald-500/20 rounded-xl animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
          </div>
        </div>
      )}

      {/* Used state success icon */}
      {ticketStatus === 'USED' && (
        <div className="flex flex-col items-center justify-center space-x-4 space-y-4">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-emerald-400" />
            <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
          </div>
          <p className="text-xl font-bold text-white">Ticket Successfully Used</p>
        </div>
      )}

      {/* Metadata Card */}
      <div className="w-full max-w-md bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-6 space-y-4 backdrop-blur-xl">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Token ID</p>
          <p className="text-3xl font-bold font-mono text-cyan-400">{tokenId}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Contract</p>
          <p className="text-xs font-mono text-slate-300 break-all">{contractAddress}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Tier</p>
          <p className="text-lg font-bold text-emerald-400 uppercase">{tier}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Perks</p>
          <ul className="space-y-2 text-slate-300 font-mono text-sm">
            {perks.map((perk, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-slate-950/60 border border-cyan-500/20 rounded-lg group hover:border-cyan-500/50 transition-all">
                <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span className="group-hover:text-cyan-300 transition-colors">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3">
        {/* Scan QR Button (only if UNUSED and not scanning) */}
        {ticketStatus === 'UNUSED' && !isScanning && (
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="relative w-full py-4 px-6 bg-cyan-500 text-slate-950 font-bold rounded-lg overflow-hidden group hover:bg-cyan-400 transition-all duration-200 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 active:scale-[0.98]"
          >
            <Zap className="h-5 w-5 mr-2" />
            <span>SCAN QR AT GATE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        )}

        {/* Claim Perks Button */}
        <button
          onClick={handleClaim}
          disabled={isPerkClaimed}
          className="w-full py-4 px-6 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/40 hover:bg-emerald-500/30 hover:border-emerald-500/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
        >
          {isPerkClaimed ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Perks Claimed</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Claim Perks</span>
            </>
          )}
        </button>
      </div>

      {/* Loading overlay when scanning (fallback) */}
      {isScanning && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <Zap className="h-6 w-6 text-cyan-400 animate-spin" />
            <p className="mt-2 text-sm text-slate-400 font-mono">Verifying ticket at gate...</p>
          </div>
        </div>
      )}
    </div>
  );
}