import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all work orders for an organization
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('work_orders')
      .select(`
        *,
        property:properties(*),
        services:work_order_services(*, service:services(*)),
        progress_updates:progress_updates(count),
        created_by_user:users(first_name, last_name, email)
      `)
      .eq('organization_id', organizationId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching work orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch work orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workOrders: data || [],
    });
  } catch (error) {
    console.error('Work orders GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new work order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      userId,
      propertyId,
      priority,
      scheduledDate,
      description,
      accessInstructions,
      services, // Array of { serviceId, quantity, billingFrequency }
      billingFrequency = 'one-time',
    } = body;

    // Validate required fields
    if (!organizationId || !propertyId || !services || services.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate work order number
    const { data: lastWO } = await supabase
      .from('work_orders')
      .select('wo_number')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let woNumber = 'WO-2025-0001';
    if (lastWO?.wo_number) {
      const lastNumber = parseInt(lastWO.wo_number.split('-')[2]);
      woNumber = `WO-2025-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    // Calculate total cost
    const { data: servicesData } = await supabase
      .from('services')
      .select('id, base_price')
      .in('id', services.map((s: any) => s.serviceId));

    let totalCost = 0;
    if (servicesData) {
      services.forEach((service: any) => {
        const serviceInfo = servicesData.find((s) => s.id === service.serviceId);
        if (serviceInfo) {
          totalCost += serviceInfo.base_price * (service.quantity || 1);
        }
      });
    }

    // Create work order
    const { data: workOrder, error: woError } = await supabase
      .from('work_orders')
      .insert({
        wo_number: woNumber,
        organization_id: organizationId,
        created_by: userId,
        property_id: propertyId,
        priority: priority || 'normal',
        scheduled_date: scheduledDate,
        description,
        access_instructions: accessInstructions,
        total_cost: totalCost,
        billing_frequency: billingFrequency,
        status: 'new',
      })
      .select()
      .single();

    if (woError) {
      console.error('Error creating work order:', woError);
      return NextResponse.json(
        { error: 'Failed to create work order' },
        { status: 500 }
      );
    }

    // Create work order services
    const workOrderServices = services.map((service: any) => ({
      work_order_id: workOrder.id,
      service_id: service.serviceId,
      quantity: service.quantity || 1,
      billing_frequency: service.billingFrequency || billingFrequency,
      unit_price: servicesData?.find((s) => s.id === service.serviceId)?.base_price || 0,
      status: 'pending',
    }));

    const { error: servicesError } = await supabase
      .from('work_order_services')
      .insert(workOrderServices);

    if (servicesError) {
      console.error('Error creating work order services:', servicesError);
      // Work order was created, but services failed - consider this partial success
    }

    return NextResponse.json({
      success: true,
      workOrder,
    });
  } catch (error) {
    console.error('Work orders POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
