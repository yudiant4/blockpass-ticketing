'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Zap } from 'lucide-react';
import { css } from '../../styled-system/css';

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

  return (
    <div className={css({
      minHeight: '100vh',
      bg: 'bg',
      color: 'text',
      p: '4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6',
    })}>
      {/* Header with status badge */}
      <div className={css({
        width: 'full',
        maxWidth: 'md',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      })}>
        <h2 className={css({
          fontSize: 'xl',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: 'cyan',
          letterSpacing: 'widest',
        })}>
          Event Day Ticket
        </h2>
        <span className={css({
          px: '3',
          py: '1',
          borderRadius: 'full',
          fontSize: 'sm',
          fontWeight: 'medium',
          borderWidth: '1px',
          borderStyle: 'solid',
          bg: ticketStatus === 'UNUSED' ? 'emerald.500/20' : 'card',
          color: ticketStatus === 'UNUSED' ? 'emerald.400' : 'text',
          borderColor: ticketStatus === 'UNUSED' ? 'emerald.500/40' : 'border',
        })}>
          {ticketStatus}
        </span>
      </div>

      {/* QR Code Section - Fixed Layout */}
      {ticketStatus === 'UNUSED' && !isScanning && (
        <div className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4',
          width: 'full',
        })}>
          {/* QR Container with dramatic effects - Fixed Layout */}
          <div className={css({
            position: 'relative',
            width: '280px',
            height: '280px',
          })}>
            {/* Outer glow ring */}
            <div className={css({
              position: 'absolute',
              inset: '0',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'cyan.500/30',
              borderRadius: 'xl',
              animation: 'pulseBlob 2s infinite',
            })} />

            {/* Inner container */}
            <div className={css({
              position: 'relative',
              width: 'full',
              height: 'full',
              bg: 'card/80',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'cyan.500/40',
              borderRadius: 'xl',
              p: '4',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            })}>
              {/* Corner brackets */}
              <div className={css({
                position: 'absolute',
                top: '-1',
                left: '-1',
                width: '6',
                height: '6',
                borderTopWidth: '2px',
                borderLeftWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'cyan.400',
                borderTopLeftRadius: 'xl',
              })} />
              <div className={css({
                position: 'absolute',
                top: '-1',
                right: '-1',
                width: '6',
                height: '6',
                borderTopWidth: '2px',
                borderRightWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'cyan.400',
                borderTopRightRadius: 'xl',
              })} />
              <div className={css({
                position: 'absolute',
                bottom: '-1',
                left: '-1',
                width: '6',
                height: '6',
                borderBottomWidth: '2px',
                borderLeftWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'cyan.400',
                borderBottomLeftRadius: 'xl',
              })} />
              <div className={css({
                position: 'absolute',
                bottom: '-1',
                right: '-1',
                width: '6',
                height: '6',
                borderBottomWidth: '2px',
                borderRightWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'cyan.400',
                borderBottomRightRadius: 'xl',
              })} />

              {/* QR Code */}
              <div className={css({
                position: 'absolute',
                inset: '4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              })}>
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
              <div className={css({
                position: 'absolute',
                inset: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              })}>
                <Zap className="h-10 w-10 text-cyan-400/30" />
              </div>
            </div>
          </div>

          {/* Gate pass label - FIXED: Now BELOW the QR code, not overlapping */}
          <div className={css({
            textAlign: 'center',
            mt: '4',
          })}>
            <p className={css({
              fontFamily: 'mono',
              fontSize: 'xs',
              color: 'cyan.400/70',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
            })}>
              GATE PASS READY
            </p>
          </div>
        </div>
      )}

      {/* Scanning Animation Overlay */}
      {isScanning && (
        <div className={css({
          position: 'fixed',
          inset: '0',
          bg: 'bg/90',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '50',
        })}>
          <div className={css({
            position: 'relative',
            width: '280px',
            height: '280px',
          })}>
            <div className={css({
              position: 'absolute',
              inset: '0',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'cyan.500/30',
              borderRadius: 'xl',
            })} />
            <div className={css({
              position: 'absolute',
              inset: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}>
              <div className={css({
                width: '240px',
                height: '240px',
                bg: 'card/80',
                borderRadius: 'xl',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: '6',
              })}>
                <Zap className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
                <p className={css({
                  fontFamily: 'mono',
                  fontSize: 'sm',
                  color: 'cyan',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                })}>
                  SCANNING...
                </p>
                <div className={css({
                  mt: '6',
                  width: 'full',
                  height: '2',
                  bg: 'bg',
                  borderRadius: 'full',
                  overflow: 'hidden',
                })}>
                  <div
                    className={css({
                      height: 'full',
                      bg: 'gradient-to-r from-cyan.500 via-emerald.500 to-amber.500',
                      borderRadius: 'full',
                      transition: 'all 300ms',
                    })}
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className={css({
                  mt: '3',
                  fontFamily: 'mono',
                  fontSize: 'xs',
                  color: 'text',
                })}>
                  {scanProgress}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Used state success icon */}
      {ticketStatus === 'USED' && (
        <div className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4',
        })}>
          <div className={css({ position: 'relative' })}>
            <CheckCircle className="h-16 w-16 text-emerald-400" />
            <div className={css({
              position: 'absolute',
              inset: '0',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'emerald.500/30',
              borderRadius: 'full',
              animation: 'pulseBlob 2s infinite',
            })} />
          </div>
          <p className={css({
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'text',
          })}>
            Ticket Successfully Used
          </p>
        </div>
      )}

      {/* Metadata Card */}
      <div className={css({
        width: 'full',
        maxWidth: 'md',
        bg: 'card/60',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'cyan.500/30',
        borderRadius: '2xl',
        p: '6',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
      })}>
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
          <p className={css({
            fontSize: 'xs',
            fontWeight: 'medium',
            color: 'text',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
          })}>
            Token ID
          </p>
          <p className={css({
            fontSize: '3xl',
            fontWeight: 'bold',
            fontFamily: 'mono',
            color: 'cyan',
          })}>
            {tokenId}
          </p>
        </div>

        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
          <p className={css({
            fontSize: 'xs',
            fontWeight: 'medium',
            color: 'text',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
          })}>
            Contract
          </p>
          <p className={css({
            fontSize: 'xs',
            fontFamily: 'mono',
            color: 'text',
          })}>
            {contractAddress}
          </p>
        </div>

        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
          <p className={css({
            fontSize: 'xs',
            fontWeight: 'medium',
            color: 'text',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
          })}>
            Tier
          </p>
          <p className={css({
            fontSize: 'lg',
            fontWeight: 'bold',
            color: 'emerald',
            textTransform: 'uppercase',
          })}>
            {tier}
          </p>
        </div>

        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
          <p className={css({
            fontSize: 'xs',
            fontWeight: 'medium',
            color: 'text',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
          })}>
            Perks
          </p>
          <ul className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
            fontFamily: 'mono',
            fontSize: 'sm',
            color: 'text',
          })}>
            {perks.map((perk, idx) => (
              <li
                key={idx}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3',
                  p: '3',
                  bg: 'card/60',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'cyan.500/20',
                  borderRadius: 'lg',
                  _hover: {
                    borderColor: 'cyan.500/50',
                  },
                })}
              >
                <span className={css({
                  width: '2',
                  height: '2',
                  bg: 'cyan.400',
                  borderRadius: 'full',
                })} />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={css({
        width: 'full',
        maxWidth: 'md',
        display: 'flex',
        flexDirection: 'column',
        gap: '3',
      })}>
        {ticketStatus === 'UNUSED' && !isScanning && (
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={css({
              width: 'full',
              py: '4',
              px: '6',
              bg: 'cyan',
              color: 'bg',
              fontWeight: 'bold',
              borderRadius: 'lg',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms',
              boxShadow: 'shadow.cyan.500/30',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2',
              _hover: {
                bg: 'cyan.400',
                boxShadow: 'shadow.cyan.500/40',
              },
            })}
          >
            <Zap className="h-5 w-5" />
            <span>SCAN QR AT GATE</span>
          </button>
        )}

        <button
          onClick={handleClaim}
          disabled={isPerkClaimed}
          className={css({
            width: 'full',
            py: '4',
            px: '6',
            bg: 'emerald.500/20',
            color: 'emerald.400',
            fontWeight: 'bold',
            borderRadius: 'lg',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'emerald.500/40',
            cursor: 'pointer',
            transition: 'all 200ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2',
            _hover: {
              bg: 'emerald.500/30',
              borderColor: 'emerald.500/60',
            },
            _disabled: {
              opacity: '0.5',
              cursor: 'not-allowed',
            },
          })}
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
    </div>
  );
}