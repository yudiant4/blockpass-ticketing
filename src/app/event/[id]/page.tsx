'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { css } from '../../../../styled-system/css';
import dynamic from 'next/dynamic';

const EventDayTicket = dynamic(() => import('../../../components/EventDayTicket'), {
  ssr: false,
  loading: () => css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    color: 'text',
    fontFamily: 'mono',
    fontSize: 'xs',
    textTransform: 'uppercase',
    letterSpacing: 'widest',
    children: '// Loading Gate...',
  }),
});

const ticketTiers = [
  {
    id: 1,
    name: 'REGULAR',
    price: '0.001 ETH',
    network: 'Ethereum',
    accent: 'cyan',
    glow: 'shadow.cyan.500/30',
    border: 'border.cyan.500/50',
    badgeBg: 'bg.cyan.500/20',
    badgeText: 'text.cyan.400',
  },
  {
    id: 2,
    name: 'VIP',
    price: '0.003 ETH',
    network: 'Ethereum',
    accent: 'emerald',
    glow: 'shadow.emerald.500/30',
    border: 'border.emerald.500/50',
    badgeBg: 'bg.emerald.500/20',
    badgeText: 'text.emerald.400',
  },
  {
    id: 3,
    name: 'VVIP',
    price: '0.01 ETH',
    network: 'Ethereum',
    accent: 'amber',
    glow: 'shadow.amber.500/30',
    border: 'border.amber.500/50',
    badgeBg: 'bg.amber.500/20',
    badgeText: 'text.amber.400',
  },
];

export default function EventDynamicPage() {
  const params = useParams();
  const eventId = params?.id ? parseInt(params.id as string, 10) : 1;

  const [activeTab, setActiveTab] = useState<'pre' | 'day' | 'post'>('pre');
  const [selectedTier, setSelectedTier] = useState<number>(2);

  return css({
    display: 'flex',
    minHeight: '100vh',
    bg: 'bg',
    color: 'text',
    position: 'relative',
    overflow: 'hidden',
    pt: '100px',
    pb: '120px',
    children: [
      {/* Animated background orbs */}
      css({
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        children: [
          css({
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: 80,
            height: 80,
            bg: 'cyan.500/10',
            borderRadius: 'full',
            blur: '3xl',
            animation: 'pulseBlob 4s infinite',
          }),
          css({
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: 80,
            height: 80,
            bg: 'emerald.500/10',
            borderRadius: 'full',
            blur: '3xl',
            animation: 'pulseBlob 5s infinite 1s',
          }),
          css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 96,
            height: 96,
            bg: 'amber.500/5',
            borderRadius: 'full',
            blur: '3xl',
            animation: 'pulseBlob 6s infinite 2s',
          }),
        ],
      }),
      {/* Main container */}
      css({
        position: 'relative',
        zIndex: 10,
        maxWidth: '4xl',
        mx: 'auto',
        px: 4,
        py: 24,
        children: [
          {/* Header */}
          css({
            mb: 8,
            textAlign: 'center',
            children: [
              css({
                display: 'inline-block',
                px: 3,
                py: 1,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'border',
                borderRadius: 'md',
                fontFamily: 'mono',
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'text',
                mb: 4,
                children: [
                  `Event ${eventId} • NFT Ticketing`,
                ],
              }),
              css({
                fontSize: ['3xl', '4xl'],
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'text',
                tracking: 'wide',
                children: [
                  'ALAS TRAIL RUN ',
                  css({
                    color: 'cyan',
                    children: '2026',
                  }),
                ],
              }),
              css({
                mt: 3,
                fontSize: 'sm',
                color: 'text',
                fontFamily: 'mono',
                children: [
                  'Pacet, Mojokerto • ',
                  css({
                    color: 'emerald',
                    children: 'Aug 15, 2026',
                  }),
                ],
              }),
            ],
          }),

          {/* Tab Navigation */}
          css({
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            mb: 8,
            p: 2,
            bg: 'card/80',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'xl',
            backdropBlur: 'xl',
            children: [
              { key: 'pre', label: '01 // PRE-EVENT' },
              { key: 'day', label: '02 // EVENT DAY' },
              { key: 'post', label: '03 // POST-EVENT' },
            ].map((tab) => css({
              key: tab.key,
              onClick: () => setActiveTab(tab.key as 'pre' | 'day' | 'post'),
              flex: 1,
              px: 6,
              py: '2.5',
              borderRadius: 'lg',
              fontFamily: 'mono',
              fontSize: 'xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              tracking: 'widest',
              transitionAll: 'duration-200',
              css: {
                backgroundColor: activeTab === tab.key
                  ? 'cyan.500'
                  : 'card/60',
                color: activeTab === tab.key
                  ? 'bg'
                  : 'text',
                boxShadow: activeTab === tab.key
                  ? 'shadow-lg shadow-cyan-500/30'
                  : 'none',
                _hover: {
                  backgroundColor: !(
                    activeTab === tab.key
                  ) && 'cyan.400',
                  color: !(
                    activeTab === tab.key
                  ) && 'text',
                },
              },
              children: tab.label,
            })),
          ],

          {/* Tab Content */}
          activeTab === 'pre' && css({
            bg: 'card/60',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: '2xl',
            p: 6,
            backdropBlur: 'xl',
            children: [
              css({
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                children: [
                  css({
                    width: 2,
                    height: 2,
                    bg: 'cyan.400',
                    borderRadius: 'full',
                    animation: 'pulse 2s infinite',
                  }),
                  css({
                    fontFamily: 'mono',
                    fontSize: 'xs',
                    textTransform: 'uppercase',
                    letterSpacing: 'widest',
                    color: 'cyan',
                    children: 'Tier Selection',
                  }),
                ],
              }),
              css({
                fontSize: 'xl',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'text',
                mb: 1,
                children: 'Select Your Tier',
              }),
              css({
                mt: 3,
                fontSize: 'xs',
                color: 'text',
                fontFamily: 'mono',
                mb: 6,
                children: '// Pilih tier & selesaikan transaksi untuk membuka Event Day Gate Pass',
              }),
              css({
                display: 'grid',
                gridTemplateColumns: ['1fr', 'md:3fr'],
                gap: 4,
                mb: 6,
                children: ticketTiers.map((tier) => css({
                  key: tier.id,
                  onClick: () => setSelectedTier(tier.id),
                  position: 'relative',
                  p: 4,
                  borderRadius: 'xl',
                  textAlign: 'left',
                  transitionAll: 'duration-300',
                  bg: 'card/60',
                  backdropBlur: 'xl',
                  overflow: 'hidden',
                  css: {
                    border: selectedTier === tier.id
                      ? `${tier.border} ${tier.glow} ring-2 ring-${tier.accent}-500/50 scale-[1.02]`
                      : 'border.border.border/20 hover:border/60 hover:scale-102',
                  },
                  children: [
                    {/* Tier accent bar */}
                    css({
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      bg: 'gradient-to-b from-cyan-500 via-emerald-500 to-amber-500',
                    }),
                    css({
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      children: [
                        css({
                          fontFamily: 'mono',
                          fontSize: 'xs',
                          textTransform: 'uppercase',
                          letterSpacing: 'widest',
                          px: 2,
                          py: '0.5',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: `border.${tier.accent}-500/40`,
                          color: `text.${tier.accent}.400`,
                          children: `${tier.name} PASS`,
                        }),
                        css({
                          fontFamily: 'mono',
                          fontSize: 'xs',
                          color: `text.${tier.accent}.400`,
                          textTransform: 'uppercase',
                          children: tier.network,
                        }),
                      ],
                    }),
                    css({
                      fontSize: '2xl',
                      fontWeight: 'bold',
                      fontFamily: 'mono',
                      color: 'text',
                      children: tier.price,
                    }),
                    css({
                      mt: 1,
                      fontSize: 'xs',
                      color: 'text',
                      fontFamily: 'mono',
                      children: [
                        `≈ Rp`,
                        tier.id === 1 ? '50.000' : tier.id === 2 ? '150.000' : '500.000',
                      ],
                    }),
                    {/* Hover shimmer */}
                    css({
                      position: 'absolute',
                      inset: 0,
                      bg: 'gradient-to-r from-transparent via-white/5 to-transparent',
                      transform: 'translateX(-100%)',
                      transition: 'transform duration-700',
                      _hover: {
                        transform: 'translateX(0)',
                      },
                    }),
                  ],
                }),
              }),
              css({
                width: 'full',
                p: [3, 6],
                bg: 'cyan.500',
                color: 'bg',
                fontFamily: 'mono',
                fontSize: ['xs'],
                fontWeight: ['bold', 'uppercase'],
                tracking: 'wider',
                borderRadius: 'lg',
                hover: {
                  bg: 'cyan.400',
                },
                transition: 'all duration-200',
                shadow: 'shadow-lg shadow-cyan-500/30',
                children: [
                  { '>': ' ' },
                  'MINT TIKET SEKARANG',
                ],
              }),
              css({
                mt: 4,
                p: 3,
                bg: 'card/60',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'border',
                borderRadius: 'lg',
                fontFamily: 'mono',
                fontSize: 'xs',
                color: 'text',
                children: [
                  css({
                    color: 'cyan',
                    children: '// STATUS:',
                  }),
                  ' Wallet belum terhubung. Klik ',
                  css({
                    color: 'cyan',
                    children: '"Connect Wallet" di header untuk mulai mint.',
                  }),
                ],
              }),
            ],
          }),

          activeTab === 'day' && css({
            children: [
              css({
                tokenId: selectedTier,
                contractAddress: '0xbdb5f9745Db186C25424fA0EC5b81009980B87c2',
                ownerAddress: '0x8fc179213fb33f2bf61c8abae3d2a469e9f167b9',
                tier: ticketTiers[selectedTier].name,
                tierData: {
                  accent: selectedTier === 0 ? 'cyan' : selectedTier === 1 ? 'emerald' : 'amber',
                  glow: selectedTier === 0 ? 'shadow.cyan.500/30' : selectedTier === 1 ? 'shadow.emerald.500/30' : 'shadow.amber.500/30',
                  border: selectedTier === 0 ? 'border.cyan.500/50' : selectedTier === 1 ? 'border.emerald.500/50' : 'border.amber.500/50',
                  badgeBg: selectedTier === 0 ? 'bg.cyan.500/20' : selectedTier === 1 ? 'bg.emerald.500/20' : 'bg.amber.500/20',
                  badgeText: selectedTier === 0 ? 'text.cyan.400' : selectedTier === 1 ? 'text.emerald.400' : 'text.amber.400',
                },
                perks: ticketTiers[selectedTier].benefits,
                status: 'UNUSED',
              }, {}, 'EventDayTicket'),
            ],
          }),

          activeTab === 'post' && css({
            bg: 'card/60',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: '2xl',
            p: 8,
            textAlign: 'center',
            backdropBlur: 'xl',
            children: [
              css({
                display: 'inline-block',
                px: 3,
                py: 1,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'border',
                borderRadius: 'md',
                fontFamily: 'mono',
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'emerald',
                children: 'FINISHER POAP',
              }, {}, 'span'),
              css({
                fontSize: ['2xl'],
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'text',
                mb: 2,
                children: 'Digital Souvenir & Attendance POAP',
              }),
              css({
                mt: 3,
                fontSize: 'sm',
                color: 'text',
                fontFamily: 'mono',
                maxWidth: 'md',
                mx: 'auto',
                children: [
                  '// Acara telah selesai. Tiket NFT Anda kini tersimpan permanen di wallet sebagai',
                  css({
                    display: 'block',
                    mb: 2,
                  }),
                  'bukti kehadiran bersejarah.',
                ],
              }),
            ],
          }),

          {/* Footer */}
          css({
            mt: 10,
            textAlign: 'center',
            children: [
              css({
                display: 'inline-block',
                fontFamily: 'mono',
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'text',
                transition: 'all duration-200',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'border',
                hover: {
                  borderColor: 'cyan',
                },
                px: 4,
                py: 2,
                borderRadius: 'md',
                _hover: {
                  bg: 'card/60',
                  backdropBlur: '',
                },
                children: [
                  {'<': ' '},
                  'KEMBALI KE MARKETPLACE',
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}