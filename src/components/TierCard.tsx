'use client';
import { css } from '../../styled-system/css';

type Props = {
  tierId: number;
  label: string;
  price: string;
  maxSupply: number;
  sold: number;
  isActiveMinting: boolean;
};

export default function TierCard({
  tierId,
  label,
  price,
  maxSupply,
  sold,
  isActiveMinting,
}: Props) {
  return (
    <div
      className={css({
        p: '4',
        bg: 'surface',
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: 'border',
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '2',
        })}
      >
        <h3 className={css({ color: 'text', fontSize: 'lg' })}>{label}</h3>
        <span
          className={css({
            px: '2',
            py: '1',
            borderRadius: 'md',
            fontSize: 'sm',
            fontWeight: 'bold',
            color: 'white',
            bg: tierId === 1 ? 'emerald' : tierId === 2 ? 'cyan' : 'purple',
          })}
        >
          ₺{price}
        </span>
      </div>
      <p className={css({ color: 'muted', mb: '3' })}>
        Tersisa: {maxSupply - sold} / {maxSupply}
      </p>
      <button
        disabled={!isActiveMinting || sold >= maxSupply}
        className={css({
          w: 'full',
          py: '2',
          borderRadius: 'md',
          bg: sold >= maxSupply ? 'muted' : 'neon',
          color: 'black',
          fontWeight: 'bold',
          cursor: sold >= maxSupply ? 'not-allowed' : 'pointer',
          '&:hover': {
            bg: sold >= maxSupply ? 'muted' : 'emerald',
          },
        })}
      >
        {sold >= maxSupply ? 'HABIS' : `BUY TIKET`}
      </button>
    </div>
  );
}
