import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DEVELOPMENT ONLY - Remove in production
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Update user role to admin
    const { error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', user.id) as any;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User role updated to admin. Please log out and log back in.',
      userId: user.id 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
