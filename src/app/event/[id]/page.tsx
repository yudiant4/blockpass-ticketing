'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { css } from '../../../../styled-system/css';
import dynamic from 'next/dynamic';

const EventDayTicket = dynamic(() => import('../../../components/EventDayTicket'), {
  ssr: false,
  loading: () => (
    <div className={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '64',
      color: 'cyan',
      fontFamily: 'mono',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'widest',
    })}>
      {'// Loading Gate...'}
    </div>
  ),
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

  const selectedTierData = ticketTiers[selectedTier - 1] || ticketTiers[1];

  return (
    <main
      className={css({
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        position: 'relative',
        overflow: 'hidden',
        pt: '100px',
        pb: '120px',
      })}
      style={{
        backgroundImage:
          'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Animated background orbs */}
      <div className={css({
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        pointerEvents: 'none',
      })}>
        <div className={css({
          position: 'absolute',
          top: '-40',
          right: '-40',
          width: '80',
          height: '80',
          bg: 'cyan.500/10',
          borderRadius: 'full',
          filter: 'blur(3xl)',
          animation: 'pulseBlob 4s infinite',
        })} />
        <div className={css({
          position: 'absolute',
          bottom: '-40',
          left: '-40',
          width: '80',
          height: '80',
          bg: 'emerald.500/10',
          borderRadius: 'full',
          filter: 'blur(3xl)',
          animation: 'pulseBlob 5s infinite 1s',
        })} />
        <div className={css({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '96',
          height: '96',
          bg: 'amber.500/5',
          borderRadius: 'full',
          filter: 'blur(3xl)',
          animation: 'pulseBlob 6s infinite 2s',
        })} />
      </div>

      <div className={css({
        position: 'relative',
        zIndex: '10',
        maxWidth: '4xl',
        mx: 'auto',
        px: '4',
        py: '24',
      })}>
        {/* Header */}
        <div className={css({ mb: '8', textAlign: 'center' })}>
          <div className={css({
            display: 'inline-block',
            px: '3',
            py: '1',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'md',
            fontFamily: 'mono',
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            color: 'cyan',
            mb: '4',
          })}>
            {`Event #${eventId} • NFT Ticketing`}
          </div>
          <h1 className={css({
            fontSize: { base: '3xl', md: '4xl' },
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: 'text',
            letterSpacing: 'wide',
          })}>
            ALAS TRAIL RUN <span className={css({ color: 'cyan' })}>2026</span>
          </h1>
          <p className={css({
            mt: '3',
            fontSize: 'sm',
            color: 'text',
            fontFamily: 'mono',
          })}>
            Pacet, Mojokerto • <span className={css({ color: 'emerald' })}>Aug 15, 2026</span>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={css({
          display: 'flex',
          justifyContent: 'center',
          gap: '3',
          mb: '8',
          p: '2',
          bg: 'card/80',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          borderRadius: 'xl',
          backdropFilter: 'blur(20px)',
        })}>
          {[
            { key: 'pre', label: '01 // PRE-EVENT' },
            { key: 'day', label: '02 // EVENT DAY' },
            { key: 'post', label: '03 // POST-EVENT' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'pre' | 'day' | 'post')}
              className={css({
                flex: '1',
                px: '4',
                py: '2.5',
                borderRadius: 'lg',
                fontFamily: 'mono',
                fontSize: 'xs',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                transition: 'all 200ms',
                cursor: 'pointer',
                bg: activeTab === tab.key ? 'cyan' : 'card/60',
                color: activeTab === tab.key ? 'bg' : 'text',
                boxShadow: activeTab === tab.key ? 'shadow.cyan.500/30' : 'none',
                _hover: {
                  bg: activeTab === tab.key ? 'cyan' : 'cyan.500/10',
                  color: activeTab === tab.key ? 'bg' : 'cyan',
                },
              })}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - Pre-Event */}
        {activeTab === 'pre' && (
          <div className={css({
            bg: 'card/60',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: '2xl',
            p: '6',
            backdropFilter: 'blur(20px)',
          })}>
            <div className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              mb: '4',
            })}>
              <span className={css({
                width: '2',
                height: '2',
                bg: 'cyan.400',
                borderRadius: 'full',
                animation: 'pulseBlob 2s infinite',
              })} />
              <span className={css({
                fontFamily: 'mono',
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'cyan',
              })}>
                Tier Selection
              </span>
            </div>

            <h2 className={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'text',
              mb: '1',
            })}>
              Select Your Tier
            </h2>
            <p className={css({
              fontSize: 'xs',
              color: 'text',
              fontFamily: 'mono',
              mb: '6',
            })}>
              {'// Pilih tier & selesaikan transaksi untuk membuka Event Day Gate Pass'}
            </p>

            <div className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              gap: '4',
              mb: '6',
            })}>
              {ticketTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={css({
                    position: 'relative',
                    p: '4',
                    borderRadius: 'xl',
                    textAlign: 'left',
                    transition: 'all 300ms',
                    bg: 'card/60',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: selectedTier === tier.id ? tier.border : 'border',
                    boxShadow: selectedTier === tier.id ? tier.glow : 'none',
                    transform: selectedTier === tier.id ? 'scale(1.02)' : 'scale(1)',
                    _hover: {
                      borderColor: 'cyan.500/60',
                      transform: 'scale(1.02)',
                    },
                  })}
                >
                  {/* Tier accent bar */}
                  <div className={css({
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    bottom: '0',
                    width: '1',
                    bg: 'gradient-to-b from-cyan.500 via-emerald.500 to-amber.500',
                  })} />

                  <div className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '2',
                  })}>
                    <span className={css({
                      fontFamily: 'mono',
                      fontSize: 'xs',
                      textTransform: 'uppercase',
                      letterSpacing: 'widest',
                      px: '2',
                      py: '0.5',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: tier.border,
                      color: tier.badgeText,
                      bg: tier.badgeBg,
                      borderRadius: 'md',
                    })}>
                      {`${tier.name} PASS`}
                    </span>
                    <span className={css({
                      fontFamily: 'mono',
                      fontSize: 'xs',
                      color: 'emerald',
                      textTransform: 'uppercase',
                    })}>
                      {tier.network}
                    </span>
                  </div>
                  <div className={css({
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    fontFamily: 'mono',
                    color: 'text',
                  })}>
                    {tier.price}
                  </div>
                  <div className={css({
                    mt: '1',
                    fontSize: 'xs',
                    color: 'text',
                    fontFamily: 'mono',
                  })}>
                    {`≈ Rp ${tier.id === 1 ? '50.000' : tier.id === 2 ? '150.000' : '500.000'}`}
                  </div>
                </button>
              ))}
            </div>

            <button className={css({
              width: 'full',
              py: '3',
              px: '6',
              bg: 'cyan',
              color: 'bg',
              fontFamily: 'mono',
              fontSize: 'xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              borderRadius: 'lg',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 200ms',
              boxShadow: 'shadow.cyan.500/30',
              _hover: {
                bg: 'cyan.400',
                boxShadow: 'shadow.cyan.500/40',
              },
            })}>
              {'> MINT TIKET SEKARANG'}
            </button>

            <div className={css({
              mt: '4',
              p: '3',
              bg: 'card/60',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'lg',
              fontFamily: 'mono',
              fontSize: 'xs',
              color: 'text',
            })}>
              <span className={css({ color: 'cyan' })}>{'// STATUS:'}</span>
              {' Wallet belum terhubung. Klik '}
              <span className={css({ color: 'cyan' })}>{'"Connect Wallet"'}</span>
              {' di header untuk mulai mint.'}
            </div>
          </div>
        )}

        {/* Tab Content - Day (EventDayTicket) */}
        {activeTab === 'day' && (
          <EventDayTicket
            tokenId={selectedTier}
            contractAddress="0xbdb5f9745Db186C25424fA0EC5b81009980B87c2"
            ownerAddress="0x8fc179213fb33f2bf61c8abae3d2a469e9f167b9"
            tier={selectedTierData.name}
            tierData={selectedTierData}
            perks={['Akses Gate Utama', 'Fast-Track Queue', 'Digital POAP Badge']}
            status="UNUSED"
          />
        )}

        {/* Tab Content - Post-Event */}
        {activeTab === 'post' && (
          <div className={css({
            bg: 'card/60',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: '2xl',
            p: '8',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
          })}>
            <div className={css({
              display: 'inline-block',
              px: '3',
              py: '1',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'emerald.500/40',
              borderRadius: 'md',
              fontFamily: 'mono',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'emerald',
              mb: '4',
            })}>
              FINISHER POAP
            </div>
            <h3 className={css({
              fontSize: '2xl',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'text',
              mb: '2',
            })}>
              Digital Souvenir & Attendance POAP
            </h3>
            <p className={css({
              fontSize: 'sm',
              color: 'text',
              fontFamily: 'mono',
              maxWidth: 'md',
              mx: 'auto',
            })}>
              {'// Acara telah selesai. Tiket NFT Anda kini tersimpan permanen di wallet sebagai bukti kehadiran bersejarah.'}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className={css({ mt: '10', textAlign: 'center' })}>
          <Link
            href="/marketplace"
            className={css({
              display: 'inline-block',
              fontFamily: 'mono',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'text',
              transition: 'all 200ms',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              px: '4',
              py: '2',
              borderRadius: 'md',
              textDecoration: 'none',
              _hover: {
                borderColor: 'cyan',
                color: 'cyan',
              },
            })}
          >
            {'< KEMBALI KE MARKETPLACE'}
          </Link>
        </div>
      </div>
    </main>
  );
}