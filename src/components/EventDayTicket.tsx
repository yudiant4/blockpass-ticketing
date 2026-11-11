'use client';
import { useState, useEffect } from 'react';
import { css } from 'styled-system/css';
import { verifyTicket } from '@/lib/blockpass';

interface QRCodeScannerProps {
  eventId: string;
  expectedTokenId: number;
  /** ISO date when scanning window ends (defaults to far future for demos) */
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
        setMessage('Acara telah berakhir');
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [endMs]);

  const handleScan = (decoded: string) => {
    try {
      const data = JSON.parse(decoded);
      if (data.eventId !== eventId) {
        onInvalid('ID acara tidak sesuai');
        return;
      }
      if (parseInt(data.tokenId, 10) !== expectedTokenId) {
        onInvalid('Token ID tidak valid');
        return;
      }
      verifyTicket(expectedTokenId, data.wallet as `0x${string}`).then((ok) => {
        ok ? onValid(data.wallet) : onInvalid('Tiket tidak ditemukan on-chain');
      });
    } catch {
      onInvalid('QR Code tidak valid');
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
      <div className={css({ p: '4', bg: 'surface', border: '1px solid token(colors.border)', borderRadius: 'md' })}>
        <p className={css({ color: 'muted', fontFamily: 'mono' })}>Scanning window closed — event ended.</p>
      </div>
    );
  }

  return (
    <div
      className={css({
        p: '4',
        background: 'surface',
        borderRadius: 'md',
        border: '1px solid',
        borderColor: 'border',
      })}
    >
      <h3 className={css({ color: 'text', mb: '4', fontFamily: 'mono' })}>Ticket Verification</h3>
      <p className={css({ color: 'muted', mb: '4', fontFamily: 'mono', fontSize: '13px' })}>
        {message}
      </p>
      {minutesLeft !== null && (
        <p className={css({ color: 'neon', mb: '4', fontFamily: 'mono', fontSize: '11px' })}>
          Window closes in ~{Math.max(0, minutesLeft)} min
        </p>
      )}
      <button
        onClick={mockScan}
        className={css({
          bg: 'neon',
          color: 'black',
          px: '4',
          py: '2',
          borderRadius: 'md',
          cursor: 'pointer',
          fontFamily: 'mono',
          fontSize: '12px',
          fontWeight: '700',
        })}
      >
        Mock Scan
      </button>
    </div>
  );
}
