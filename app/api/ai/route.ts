import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Simple rule-based AI assistant (can be replaced with actual AI API)
    const response = generateResponse(message.toLowerCase());

    // Save conversation to database
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('ai_conversations').insert({
        user_id: user.id,
        message,
        response,
      } as any);
    }

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

function generateResponse(message: string): string {
  // Internet service queries
  if (message.includes('internet') || message.includes('wifi') || message.includes('broadband')) {
    return "I can help you with internet installation! We offer:\n\n• Fiber Optic Installation - High-speed internet up to 1Gbps\n• WiFi Setup - Professional router configuration\n• Network Troubleshooting - Fix connectivity issues\n\nWould you like to book an internet installation service?";
  }

  // CCTV queries
  if (message.includes('cctv') || message.includes('camera') || message.includes('security')) {
    return "Looking for security solutions? We provide:\n\n• CCTV Installation - Indoor/outdoor cameras\n• Security System Setup - Complete monitoring solutions\n• Camera Maintenance - Regular checkups\n\nOur technicians can install 4-16 camera systems. Interested in booking?";
  }

  // TV mounting
  if (message.includes('tv') || message.includes('mount') || message.includes('wall mount')) {
    return "Need TV mounting service? We offer:\n\n• TV Wall Mounting - Secure installation on any wall type\n• Cable Management - Clean, hidden wiring\n• Soundbar Installation - Complete entertainment setup\n\nExpress service available for same-day installation!";
  }

  // Marketplace queries
  if (message.includes('buy') || message.includes('product') || message.includes('shop') || message.includes('marketplace')) {
    return "Browse our marketplace for:\n\n• Electronics - Phones, laptops, accessories\n• Furniture - Home and office furniture\n• Appliances - Kitchen and home appliances\n• Sports Equipment - Fitness and outdoor gear\n\nAll products from verified sellers with ratings and reviews!";
  }

  // Delivery queries
  if (message.includes('delivery') || message.includes('shipping') || message.includes('track')) {
    return "Track your orders easily:\n\n• Real-time delivery tracking\n• Estimated delivery dates\n• Location updates\n• Proof of delivery\n\nVisit 'My Orders' to track your deliveries!";
  }

  // Pricing queries
  if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    return "Our pricing is transparent:\n\n• Services: Starting from $50 (varies by complexity)\n• Express Service: +$20 for same-day booking\n• Products: Browse marketplace for competitive prices\n• Delivery: Flat $5 fee on all orders\n\nView detailed pricing on each service/product page!";
  }

  // General help
  if (message.includes('help') || message.includes('how') || message.includes('what')) {
    return "I'm here to help! I can assist with:\n\n• Service bookings (Internet, CCTV, TV mounting)\n• Product recommendations\n• Order tracking\n• Pricing information\n• General platform questions\n\nWhat would you like to know more about?";
  }

  // Default response
  return "Thanks for your message! I can help you with:\n\n• Booking services (Internet, CCTV, TV mounting)\n• Finding products in our marketplace\n• Tracking orders and deliveries\n• Answering questions about pricing\n\nHow can I assist you today?";
}
