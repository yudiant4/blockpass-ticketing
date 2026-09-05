import { NextRequest, NextResponse } from 'next/server';
import { publicClient, BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI, getWalletClient } from '../../lib/blockpass';
import { verifyTicket } from '../../lib/blockpass';

// POST /api/ticket/mint - Mint ticket (wallet must have ETH)
export async function POST(req: NextRequest) {
  try {
    const { privateKey, tierId, amount, eventId } = await req.json();
    
    if (!privateKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Private key diperlukan' 
      }, { status: 401 });
    }
    
    // Validate inputs
    if (![1, 2, 3].includes(tierId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tier tidak valid' 
      }, { status: 400 });
    }
    
    if (amount <= 0 || amount > 10) {
      return NextResponse.json({ 
        success: false, 
        error: 'Jumlah tidak valid' 
      }, { status: 400 });
    }
    
    // Get tier price
    const tierPrices = { 1: '0.001', 2: '0.003', 3: '0.01' };
    const total = parseFloat(tierPrices[tierId as 1 | 2 | 3]) * amount;
    
    // Create account from private key
    const { privateKeyToAccount } = await import('viem/accounts');
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    // Read-tier info before minting
    const tierInfo = await publicClient.readContract({
      address: BLOCKPASS_TICKET_ADDRESS,
      abi: BLOCKPASS_TICKET_ABI,
      functionName: 'tierInfo',
      args: [BigInt(tierId)],
    });
    
    const [maxSupply, currentSupply, price, active] = tierInfo as [bigint, bigint, bigint, boolean];
    
    if (!active) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tier tidak aktif' 
      }, { status: 400 });
    }
    
    if (currentSupply + BigInt(amount) > maxSupply) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supply sudah habis' 
      }, { status: 400 });
    }
    
    // Send mint transaction
    const { createWalletClient, http } = await import('viem');
    const walletClient = createWalletClient({
      account,
      chain: await (await import('../../config/contracts')).BASE_SEPOLIA,
      transport: http(),
    });
    
    const hash = await walletClient.deployContract({
      address: BLOCKPASS_TICKET_ADDRESS,
      abi: BLOCKPASS_TICKET_ABI,
      functionName: 'mintTicket',
      args: [BigInt(tierId), BigInt(amount)],
      value: BigInt(Number(tierPrices[tierId as 1 | 2 | 3]) * 1e18 * amount),
    });
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    return NextResponse.json({ 
      success: true, 
      data: receipt.transactionHash 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Gagal mint tiket' 
    }, { status: 500 });
  }
}

// GET /api/ticket/verify - Verify ticket ownership
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');
  const tokenId = searchParams.get('tokenId');
  
  if (!wallet || !tokenId) {
    return NextResponse.json({ 
      success: false, 
      error: 'wallet dan tokenId diperlukan' 
    }, { status: 400 });
  }
  
  try {
    const isValid = await verifyTicket(
      parseInt(tokenId), 
      wallet as `0x${string}`
    );
    
    return NextResponse.json({ 
      success: true, 
      data: { valid: isValid, wallet, tokenId } 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}