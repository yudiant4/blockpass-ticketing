'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, XCircle, Zap } from 'lucide-react';

interface EventDayTicketProps {
  tokenId: string | number;
  contractAddress: string;
  ownerAddress: string;
  tier: string;
  perks: string[]; // array of perk descriptions
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
    // Example: await writeContract({ address: contractAddress, abi, functionName: 'useTicket', args: [tokenId] });
    setTicketStatus('USED');
    setIsScanning(false);
  };

  // Handler for claiming perks
  const handleClaim = () => {
    // TODO: Call Web3 function here to mark perk as claimed (if needed)
    setIsPerkClaimed(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 flex flex-col items-center justify-center gap-6">
      {/* Header with status badge */}
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold text-mint-green">
          Event Day Ticket
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            ticketStatus === 'UNUSED'
              ? 'bg-green-600/20 text-green-400'
              : 'bg-slate-600/20 text-slate-400'
          }`}
        >
          {ticketStatus}
        </span>
      </div>

      {/* QR Code Section (only show if UNUSED) */}
      {ticketStatus === 'UNUSED' && !isScanning && (
        <div className="flex items-center justify-center w-full">
          <div className="relative w-[260px] h-[260px]">
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
              <Zap className="h-8 w-8 text-mint-green/50" />
            </div>
          </div>
        </div>
      )}

      {/* Used state success icon */}
      {ticketStatus === 'USED' && (
        <div className="flex items-center justify-center space-x-4">
          <CheckCircle className="h-12 w-12 text-green-400" />
          <p className="text-lg font-medium">
            Ticket Successfully Used
          </p>
        </div>
      )}

      {/* Metadata Card */}
      <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-slate-700">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">Token ID</p>
          <p className="text-xl font-mono text-mint-green">{tokenId}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">Contract</p>
          <p className="text-xs font-mono text-slate-300 break-all">{contractAddress}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">Tier</p>
          <p className="text-lg font-semibold text-purple-400">{tier}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">Perks</p>
          <ul className="space-y-1 text-slate-300">
            {perks.map((perk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex h-3 w-3 shrink-0 bg-mint-green/20 rounded"></span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-4">
        {/* Scan QR Button (only if UNUSED and not scanning) */}
        {ticketStatus === 'UNUSED' && !isScanning && (
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-3 px-6 bg-mint-green text-slate-900 font-semibold rounded-lg hover:bg-mint-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <Zap className="h-4 w-4 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>SCAN QR AT GATE</span>
              </>
            )}
          </button>
        )}

        {/* Claim Perks Button */}
        <button
          onClick={handleClaim}
          disabled={isPerkClaimed}
          className={`w-full py-3 px-6 bg-purple-600/20 text-purple-400 font-semibold rounded-lg border border-purple-600/30 hover:bg-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
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
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <Zap className="h-6 w-6 text-mint-green animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Verifying ticket at gate...</p>
          </div>
        </div>
      )}
    </div>
  );
}