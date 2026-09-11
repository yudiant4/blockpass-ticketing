'use client';
import { useState, useEffect } from 'react';
import { css } from 'styled-system/css';
import { verifyTicket } from '@/lib/blockpass';

interface QRCodeScannerProps {
  eventId: string;
  expectedTokenId: number;
  onValid: (wallet: string) => void;
  onInvalid: (reason: string) => void;
}

export default function QRCodeScanner({
  eventId,
  expectedTokenId,
  onValid,
  onInvalid,
}: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [message, setMessage] = useState('Silakan tunjukkan QR Code tiket Anda');
  const [timeLeft, setTimeLeft] = useState(0);
  const eventDate = new Date('2025-01-15T12:00:00+07:00');

  useEffect(() => {
    const iv = setInterval(() => {
      const diff = eventDate.getTime() - Date.now();
      const m = Math.floor(diff / 60000);
      setTimeLeft(m);
      if (m <= 0) { setScanning(false); setMessage('Acara telah berakhir'); }
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleScan = (decoded: string) => {
    try {
      const data = JSON.parse(decoded);
      if (data.eventId !== eventId) { onInvalid('ID acara tidak sesuai'); return; }
      if (parseInt(data.tokenId) !== expectedTokenId) { onInvalid('Token ID tidak valid'); return; }
      verifyTicket(expectedTokenId, data.wallet as `0x${string}`).then(ok => {
        ok ? onValid(data.wallet) : onInvalid('Tiket tidak ditemukan');
      });
    } catch { onInvalid('QR Code tidak valid'); }
  };

  const mockScan = () => {
    handleScan(JSON.stringify({ wallet: '0x1234567890abcdef1234567890abcdef12345678', tokenId: String(expectedTokenId), eventId }));
  };

  if (!scanning && timeLeft <= 0) {
    return (
      <div className={css({ p: '4', bg: 'emerald', borderRadius: 'md' })}>
        <p className={css({ color: 'white' })}>✅ Tiket valid! Silakan lanjutkan ke area acara.</p>
      </div>
    );
  }

  return (
    <div className={css({ p: '4', background: 'surface', borderRadius: 'md', border: '1px solid', borderColor: 'border' })}>
      <h3 className={css({ color: 'text', mb: '4' })}>Verifikasi Tiket</h3>
      <p className={css({ color: 'muted', mb: '4' })}>{message}</p>
      <button onClick={mockScan} className={css({ bg: 'neon', color: 'black', px: '4', py: '2', borderRadius: 'md', cursor: 'pointer' })}>
        Mock Scan
      </button>
    </div>
  );
}