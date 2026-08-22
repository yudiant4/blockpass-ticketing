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

  const qrData = `${contractAddress}-${tokenId}-${ownerAddress}`;

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

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setTicketStatus('USED');
    setIsScanning(false);
  };

  const handleClaim = () => {
    setIsPerkClaimed(true);
  };

  const { border, glow, badgeBg, badgeText } = tierData;

  return ({
    display: 'flex',
    minHeight: '100vh',
    bg: 'bg',
    color: 'text',
    p: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    children: [
      {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        children: [
          {
            fontSize: 'xl',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: 'cyan',
            tracking: 'widest',
            children: 'Event Day Ticket',
          },
          {
            display: 'inline-block',
            px: 3,
            py: 1,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: 'full',
            fontFamily: 'mono',
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            css: {
              backgroundColor: ticketStatus === 'UNUSED'
                ? 'emerald.500/20'
                : 'bg',
              color: ticketStatus === 'UNUSED'
                ? 'emerald.400'
                : 'text',
              borderColor: ticketStatus === 'UNUSED'
                ? 'emerald.500/40'
                : 'bg',
            },
            children: ticketStatus,
          },
        ],
      },
      ticketStatus === 'UNUSED' && !isScanning && {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'full',
        children: {
          position: 'relative',
          width: 280,
          height: 280,
          children: [
            {
              position: 'absolute',
              inset: 0,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'cyan.500/30',
              borderRadius: 'xl',
              animation: 'pulseBlob 2s infinite',
            },
            {
              position: 'absolute',
              inset: 4,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'cyan.500/20',
              borderRadius: 'xl',
            },
            {
              position: 'relative',
              width: '100%',
              height: '100%',
              bg: 'bg/80',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'cyan.500/40',
              borderRadius: 'xl',
              p: 4,
              backdropBlur: 'xl',
              overflow: 'hidden',
              children: [
                {
                  position: 'absolute',
                  top: -1,
                  left: -1,
                  width: 6,
                  height: 6,
                  borderTopWidth: '2px',
                  borderLeftWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'cyan.400',
                  borderTopLeftRadius: 'xl',
                },
                {
                  position: 'absolute',
                  top: -1,
                  right: -1,
                  width: 6,
                  height: 6,
                  borderTopWidth: '2px',
                  borderRightWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'cyan.400',
                  borderTopRightRadius: 'xl',
                },
                {
                  position: 'absolute',
                  bottom: -1,
                  left: -1,
                  width: 6,
                  height: 6,
                  borderBottomWidth: '2px',
                  borderLeftWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'cyan.400',
                  borderBottomLeftRadius: 'xl',
                },
                {
                  position: 'absolute',
                  bottom: -1,
                  right: -1,
                  width: 6,
                  height: 6,
                  borderBottomWidth: '2px',
                  borderRightWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'cyan.400',
                  borderBottomRightRadius: 'xl',
                },
                {
                  position: 'absolute',
                  left: 4,
                  right: 4,
                  height: 1,
                  bg: 'gradient-to-r from-transparent via-cyan-400 to-transparent',
                  borderRadius: 'full',
                  boxShadow: '0 0 20px rgba(34,211,238,0.8)',
                  animation: 'scanLine 2s linear infinite',
                },
                {
                  position: 'absolute',
                  inset: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  children: {
                    tag: 'QRCodeSVG',
                    attrs: {
                      value: qrData,
                      size: 240,
                      bgColor: 'transparent',
                      fgColor: '#00FFA3',
                      level: 'Q',
                      includeMargin: false,
                    },
                  },
                },
                {
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  children: {
                    tag: 'Zap',
                    attrs: {
                      className: 'h-10 w-10 text-cyan-400/30',
                    },
                  },
                },
              ],
            },
            {
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              fontFamily: 'mono',
              fontSize: 'xs',
              color: 'cyan.400/70',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              children: 'GATE PASS READY',
            },
          ],
        },
      },
      isScanning && {
        position: 'fixed',
        inset: 0,
        bg: 'bg/90',
        backdropBlur: 'sm',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        children: {
          position: 'relative',
          width: 280,
          height: 280,
          children: [
            {
              position: 'absolute',
              inset: 0,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'cyan.500/30',
              borderRadius: 'xl',
            },
            {
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              children: {
                width: 240,
                height: 240,
                bg: 'bg/80',
                borderRadius: 'xl',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                children: [
                  {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    children: {
                      tag: 'Zap',
                      attrs: {
                        className: 'h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4',
                      },
                    },
                  },
                  {
                    mt: 6,
                    fontSize: 'sm',
                    color: 'cyan.400',
                    fontFamily: 'mono',
                    textTransform: 'uppercase',
                    children: 'SCANNING...',
                  },
                  {
                    mt: 3,
                    width: 'full',
                    height: 2,
                    bg: 'bg',
                    borderRadius: 'full',
                    overflow: 'hidden',
                    children: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      bg: 'gradient-to-r from-cyan-500 via-emerald-500 to-amber-500',
                      borderRadius: 'full',
                      css: {
                        width: scanProgress + '%',
                      },
                    },
                  },
                  {
                    mt: 3,
                    fontSize: 'xs',
                    color: 'bg',
                    fontFamily: 'mono',
                    children: `${scanProgress}%`,
                  },
                ],
              },
            },
            {
              position: 'absolute',
              inset: 0,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'emerald.500/20',
              borderRadius: 'xl',
              animation: 'spin 3s linear infinite',
            },
            {
              position: 'absolute',
              inset: 4,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'emerald.500/20',
              borderRadius: 'xl',
              animation: 'spin 4s linear infinite reverse',
            },
          ],
        },
      },
      ticketStatus === 'USED' && {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        children: [
          {
            position: 'relative',
            children: [
              {
                tag: 'CheckCircle',
                attrs: {
                  className: 'h-16 w-16 text-emerald-400',
                },
              },
              {
                position: 'absolute',
                inset: 0,
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'emerald.500/30',
                borderRadius: 'full',
                animation: 'pulseBlob 2s infinite',
              },
            ],
          },
          {
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'text',
            children: 'Ticket Successfully Used',
          },
        ],
      },
      {
        display: 'flex',
        width: 'full',
        maxWidth: 'md',
        bg: 'bg/60',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'cyan.500/30',
        borderRadius: '2xl',
        p: 6,
        backdropBlur: 'xl',
        gap: 4,
        children: [
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            children: [
              {
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'text',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                children: 'Token ID',
              },
              {
                fontSize: '3xl',
                fontWeight: 'bold',
                fontFamily: 'mono',
                color: 'cyan',
                children: tokenId,
              },
            ],
          },
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            children: [
              {
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'text',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                children: 'Contract',
              },
              {
                fontSize: 'xs',
                fontFamily: 'mono',
                color: 'text',
                breakAll: true,
                children: contractAddress,
              },
            ],
          },
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            children: [
              {
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'text',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                children: 'Tier',
              },
              {
                fontSize: 'lg',
                fontWeight: 'bold',
                color: 'emerald',
                children: tier,
              },
            ],
          },
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            children: [
              {
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'text',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                children: 'Perks',
              },
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                children: perks.map((perk, idx) => ({
                  key: idx,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  p: 3,
                  bg: 'bg/60',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'cyan.500/20',
                  borderRadius: 'xl',
                  group: {
                    hover: {
                      borderColor: 'cyan.500/50',
                    },
                  },
                  children: [
                    {
                      width: 2,
                      height: 2,
                      bg: 'cyan.400',
                      borderRadius: 'full',
                    },
                    {
                      fontFamily: 'mono',
                      fontSize: 'sm',
                      color: 'text',
                      hover: {
                        color: 'cyan.300',
                      },
                      transition: 'all duration-200',
                      children: perk,
                    },
                  ],
                })),
              },
            ],
          },
        ],
      },
      {
        display: 'flex',
        width: 'full',
        maxWidth: 'md',
        space: 'y-3',
        children: [
          ticketStatus === 'UNUSED' && !isScanning && {
            display: 'block',
            width: 'full',
            p: [4, 6],
            bg: 'cyan.500',
            color: 'bg',
            fontFamily: 'mono',
            fontSize: ['xs'],
            fontWeight: ['bold', 'uppercase'],
            tracking: 'wider',
            borderRadius: 'lg',
            position: 'relative',
            overflow: 'hidden',
            hover: {
              bg: 'cyan.400',
            },
            transition: 'all duration-200',
            shadow: 'shadow-lg shadow-cyan-500/30',
            active: {
              transform: 'scale(0.98)',
            },
            children: [
              {
                tag: 'Zap',
                attrs: {
                  className: 'h-5 w-5 mr-2',
                },
              },
              {
                children: 'SCAN QR AT GATE',
              },
              {
                position: 'absolute',
                inset: 0,
                bg: 'gradient-to-r from-transparent via-white/20 to-transparent',
                transform: 'translateX(-100%)',
                transition: 'transform duration-700',
                _hover: {
                  transform: 'translateX(0)',
                },
              },
            ],
          },
          {
            display: 'block',
            width: 'full',
            p: [4, 6],
            bg: 'emerald.500/20',
            color: 'emerald.400',
            fontFamily: 'mono',
            fontSize: ['xs'],
            fontWeight: ['bold'],
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'emerald.500/40',
            borderRadius: 'lg',
            group: {
              hover: {
                bg: 'emerald.500/30',
                borderColor: 'emerald.500/60',
              },
            },
            disabled: {
              opacity: 0.5,
              cursor: 'not-allowed',
            },
            children: isPerkClaimed ? [
              {
                tag: 'CheckCircle',
                attrs: {
                  className: 'h-5 w-5',
                },
              },
              {
                children: 'Perks Claimed',
              },
            ] : [
              {
                tag: 'Zap',
                attrs: {
                  className: 'h-5 w-5',
                },
              },
              {
                children: 'Claim Perks',
              },
            ],
          },
        ],
      },
    ],
  });
}