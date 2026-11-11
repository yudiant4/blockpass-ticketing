'use client';

import { useEffect, useState } from 'react';
import { verifyTicket } from '@/lib/blockpass';

interface QRCodeScannerProps {
  eventId: string;
  expectedTokenId: number;
  endsAt?: string;
  onValid: (wallet: string) => void;
  onInvalid: (reason: string) => void;
}

export default function QRCodeScanner({
  eventId,
  expectedTokenId,
  endsAt,
  onValid,
  onInvalid,
}: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [message, setMessage] = useState('Present your ticket QR code');
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const endMs = endsAt ? new Date(endsAt).getTime() : Date.now() + 24 * 60 * 60 * 1000;

  useEffect(() => {
    const iv = setInterval(() => {
      const diff = endMs - Date.now();
      const m = Math.floor(diff / 60000);
      setMinutesLeft(m);
      if (diff <= 0) {
        setScanning(false);
        setMessage('Event has ended');
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [endMs]);

  const handleScan = (decoded: string) => {
    try {
      const data = JSON.parse(decoded);
      if (data.eventId !== eventId) {
        onInvalid('Event ID mismatch');
        return;
      }
      if (parseInt(data.tokenId, 10) !== expectedTokenId) {
        onInvalid('Token ID invalid');
        return;
      }
      verifyTicket(expectedTokenId, data.wallet as `0x${string}`).then((ok) => {
        ok ? onValid(data.wallet) : onInvalid('Ticket not found on-chain');
      });
    } catch {
      onInvalid('Invalid QR code');
    }
  };

  const mockScan = () => {
    handleScan(
      JSON.stringify({
        wallet: '0x1234567890abcdef1234567890abcdef12345678',
        tokenId: String(expectedTokenId),
        eventId,
      })
    );
  };

  if (!scanning && minutesLeft !== null && minutesLeft <= 0) {
    return (
      <div style={{ padding: 16 }}>
        <p className="bp-mono" style={{ color: 'var(--bp-muted)' }}>
          Scanning window closed — event ended.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 18 }}>
      <h3 className="bp-mono" style={{ margin: '0 0 10px' }}>
        Ticket Verification
      </h3>
      <p className="bp-mono" style={{ color: 'var(--bp-muted)', fontSize: 13, marginBottom: 12 }}>
        {message}
      </p>
      {minutesLeft !== null && (
        <p className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, marginBottom: 14 }}>
          Window closes in ~{Math.max(0, minutesLeft)} min
        </p>
      )}
      <button className="bp-btn bp-btn-solid" onClick={mockScan}>
        Mock Scan
      </button>
    </div>
  );
}
