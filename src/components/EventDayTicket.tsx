'use client';

import { useState, useEffect } from 'react';
import { css } from '../../styled-system/css';
import { getUserBalance, verifyTicket, BASE_SEPOLIA, BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI } from '../../config/contracts';
import { createPublicClient } from 'viem';

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
  onInvalid 
}: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [message, setMessage] = useState('Silakan tunjukkan QR Code tiket Anda');
  const [timeLeft, setTimeLeft] = useState(0);

  // Event date (should come from event data)
  const eventDate = new Date('2025-01-15T12:00:00+07:00');
  const startTime = '12:00';
  const endTime = '23:00';

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = eventDate.getTime() - Date.now();
      const minutes = Math.floor(diff / 60000);
      setTimeLeft(minutes);
      
      if (minutes <= 0) {
        setScanning(false);
        setMessage('Acara telah berakhir');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulated scan result for demo
  const handleScan = (decoded: string) => {
    try {
      const data = JSON.parse(decoded);
      const { wallet, tokenId, signature, eventId: scannedEventId } = data;

      // Check event ID match
      if (scannedEventId !== eventId) {
        onInvalid('ID acara tidak sesuai');
        return;
      }

      // Check token ID match
      if (parseInt(tokenId) !== expectedTokenId) {
        onInvalid('Token ID tidak valid untuk acara ini');
        return;
      }

      // Verify on-chain ownership
      const publicClient = createPublicClient({
        chain: BASE_SEPOLIA,
        transport: 'https://sepolia.base.org',
      });

      verifyTicket(expectedTokenId, wallet as `0x${string}`)
        .then(isValid => {
          if (isValid) {
            onValid(wallet);
          } else {
            onInvalid('Tiket tidak ditemukan di dompet ini');
          }
        });

    } catch (e) {
      onInvalid('QR Code tidak valid');
    }
  };

  // Mock trigger for testing - replace with actual QR scanner
  const mockScan = () => {
    const mockTicket = {
      wallet: '0x1234567890abcdef1234567890abcdef12345678',
      tokenId: String(expectedTokenId),
      signature: '0x...',
      eventId: eventId,
    };
    handleScan(JSON.stringify(mockTicket));
  };

  return (
    <div>
      <div className={css({
        padding: '16px',
        borderRadius: 'md',
        background: 'surface',
        border: '1px solid',
        borderColor: 'border',
      })}>
        <h3 className={css({ color: 'text', mb: '4' })}>Verifikasi Tiket</h3>
        
        {scanning && (
          <div className={css({ mb: '4' })}>
            <p className={css({ color: 'text', mb: '2' })}>{message}</p>
            <div className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              color: 'muted',
            }))}>
              <div className={css({
                w: '2',
                h: '2',
                borderRadius: 'full',
                background: 'emerald',
                animation: 'pulseBlob 2s infinite',
              })}></div>
              <span>Siapkan QR Code di depan kamera...</span>
            </div>
            {timeLeft > 0 && (
              <p className={css({ color: 'muted', mt: '2' })}>
                Waktu tersisa: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
              </p>
            )}
          </div>
        )}

        {!scanning && timeLeft <= 0 && (
          <div className={css({ p: '4', bg: 'emerald', borderRadius: 'md' })}>
            <p className={css({ color: 'white' })}>✅ Tiket valid! Silakan lanjutkan ke area acara.</p>
          </div>
        )}

        {!scanning && timeLeft > 0 && (
          <div className={css({ p: '4', bg: 'yellow', borderRadius: 'md' })}>
            <p className={css({ color: 'black' })}>Tiket sudah dialokasikan sebelum waktu acara.</p>
          </div>
        )}
      </div>
    </div>
  );
}