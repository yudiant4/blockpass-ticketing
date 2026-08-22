'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Zap } from 'lucide-react';

interface EventDayTicketProps {
  tokenId: string | number;
  contractAddress: string;
  ownerAddress: string;
  tier: string;
  perks: string[];
  status: 'UNUSED' | 'USED';
}

export default function EventDayTicket({
  tokenId,
  contractAddress,
  ownerAddress,
  tier,
  perks,
  status,
}: EventDayTicketProps) {
  const [ticketStatus, setTicketStatus] = useState<'UNUSED' | 'USED'>(status);
  const [isPerkClaimed, setIsPerkClaimed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Generate QR data based on contract, token, and owner
  const qrData = `${contractAddress}-${tokenId}-${ownerAddress}`;

  // Handler for scanning QR at gate (simulate)
  const handleScan = async () => {
    setIsScanning(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // TODO: Call Web3 function here to mark ticket as used on-chain
    setTicketStatus('USED');
    setIsScanning(false);
  };

  // Handler for claiming perks
  const handleClaim = () => {
    // TODO: Call Web3 function here to mark perk as claimed (if needed)
    setIsPerkClaimed(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 flex flex-col items-center justify-center gap-6">
      {/* Header with status badge */}
      <div className="w-full flex justify-between items-center">
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
          <div className="relative w-[260px] h-[260px] bg-slate-900/80 border border-cyan-500/40 rounded-xl p-4 backdrop-blur">
            <QRCodeSVG
              value={qrData}
              size={260}
              bgColor="transparent"
              fgColor="#00FFA3"
              level="Q"
              includeMargin={false}
            />
            {/* Optional decorative overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Zap className="h-8 w-8 text-cyan-400/50" />
            </div>
          </div>
        </div>
      )}

      {/* Used state success icon */}
      {ticketStatus === 'USED' && (
        <div className="flex items-center justify-center space-x-4">
          <CheckCircle className="h-12 w-12 text-emerald-400" />
          <p className="text-lg font-medium text-white">
            Ticket Successfully Used
          </p>
        </div>
      )}

      {/* Metadata Card */}
      <div className="w-full max-w-md bg-slate-900/80 border border-cyan-500/40 rounded-2xl p-6 space-y-4 backdrop-blur">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Token ID</p>
          <p className="text-2xl font-bold font-mono text-cyan-400">{tokenId}</p>
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
              <li key={idx} className="flex items-center gap-2 p-2 bg-slate-950/60 border border-cyan-500/20 rounded-lg">
                <span className="w-2 h-2 bg-cyan-400 rounded"></span>
                <span>{perk}</span>
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
            className="w-full py-3 px-6 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>SCAN QR AT GATE</span>
          </button>
        )}

        {/* Claim Perks Button */}
        <button
          onClick={handleClaim}
          disabled={isPerkClaimed}
          className="w-full py-3 px-6 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPerkClaimed ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Perks Claimed</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span>Claim Perks</span>
            </>
          )}
        </button>
      </div>

      {/* Loading overlay when scanning */}
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