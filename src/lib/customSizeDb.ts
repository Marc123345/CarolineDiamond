import { supabase } from './supabase';

export interface CustomSizeRequest {
  id: string;
  user_id?: string;
  email: string;
  phone?: string;
  customer_name?: string;

  // Diamond Specifications
  desired_carat: number;
  clarity_grade?: string;
  certification?: 'GIA' | 'HRD' | 'IGI';
  shape?: string;
  color_grade?: string;

  // Ring Specifications
  metal_color?: string;
  ring_style?: string;
  ring_size?: string;

  // Budget & Preferences
  budget_min?: number;
  budget_max?: number;
  additional_notes?: string;

  // Status
  status: 'pending' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Admin
  admin_notes?: string;
  quote_amount?: number;
  quoted_at?: string;
  completed_at?: string;
  assigned_to?: string;

  // Meta
  source_url?: string;
  referrer?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomSizeRequestInput {
  email: string;
  phone?: string;
  customer_name?: string;
  desired_carat: number;
  clarity_grade?: string;
  certification?: 'GIA' | 'HRD' | 'IGI';
  shape?: string;
  color_grade?: string;
  metal_color?: string;
  ring_style?: string;
  ring_size?: string;
  budget_min?: number;
  budget_max?: number;
  additional_notes?: string;
}

export async function createCustomSizeRequest(
  input: CreateCustomSizeRequestInput
): Promise<{ data: CustomSizeRequest | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const requestData = {
      ...input,
      user_id: user?.id,
      source_url: window.location.href,
      referrer: document.referrer,
      status: 'pending' as const,
      priority: 'normal' as const,
    };

    const { data, error } = await supabase
      .from('custom_size_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      console.error('Error creating custom size request:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Track activity
    await logRequestActivity(data.id, 'created', undefined, 'pending', 'Request created by customer');

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating request:', err);
    return { data: null, error: err as Error };
  }
}

export async function getUserCustomSizeRequests(
  userId?: string
): Promise<CustomSizeRequest[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('custom_size_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user requests:', error);
    return [];
  }

  return data || [];
}

export async function getCustomSizeRequestById(
  requestId: string
): Promise<CustomSizeRequest | null> {
  const { data, error } = await supabase
    .from('custom_size_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (error) {
    console.error('Error fetching request:', error);
    return null;
  }

  return data;
}

export async function updateCustomSizeRequestStatus(
  requestId: string,
  status: CustomSizeRequest['status'],
  adminNotes?: string,
  quoteAmount?: number
): Promise<boolean> {
  const oldRequest = await getCustomSizeRequestById(requestId);
  if (!oldRequest) return false;

  const updates: any = {
    status,
  };

  if (adminNotes) {
    updates.admin_notes = adminNotes;
  }

  if (quoteAmount) {
    updates.quote_amount = quoteAmount;
    updates.quoted_at = new Date().toISOString();
  }

  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('custom_size_requests')
    .update(updates)
    .eq('id', requestId);

  if (error) {
    console.error('Error updating request status:', error);
    return false;
  }

  // Log activity
  await logRequestActivity(
    requestId,
    'status_changed',
    oldRequest.status,
    status,
    adminNotes || `Status changed from ${oldRequest.status} to ${status}`
  );

  return true;
}

export async function getAllCustomSizeRequests(
  filters?: {
    status?: CustomSizeRequest['status'];
    priority?: CustomSizeRequest['priority'];
    limit?: number;
  }
): Promise<CustomSizeRequest[]> {
  let query = supabase
    .from('custom_size_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all requests:', error);
    return [];
  }

  return data || [];
}

export async function getPendingRequestsCount(): Promise<number> {
  const { data, error } = await supabase.rpc('get_pending_requests_count');

  if (error) {
    console.error('Error getting pending count:', error);
    return 0;
  }

  return data || 0;
}

export async function getCustomSizeRequestStats(): Promise<{
  totalRequests: number;
  pendingRequests: number;
  contactedRequests: number;
  quotedRequests: number;
  completedRequests: number;
  avgProcessingTime: string;
  totalQuotedAmount: number;
}> {
  const { data, error } = await supabase.rpc('get_custom_size_request_stats');

  if (error) {
    console.error('Error getting stats:', error);
    return {
      totalRequests: 0,
      pendingRequests: 0,
      contactedRequests: 0,
      quotedRequests: 0,
      completedRequests: 0,
      avgProcessingTime: '0',
      totalQuotedAmount: 0,
    };
  }

  const stats = data[0];
  return {
    totalRequests: stats?.total_requests || 0,
    pendingRequests: stats?.pending_requests || 0,
    contactedRequests: stats?.contacted_requests || 0,
    quotedRequests: stats?.quoted_requests || 0,
    completedRequests: stats?.completed_requests || 0,
    avgProcessingTime: stats?.avg_processing_time || '0',
    totalQuotedAmount: stats?.total_quoted_amount || 0,
  };
}

async function logRequestActivity(
  requestId: string,
  action: string,
  oldStatus?: string,
  newStatus?: string,
  notes?: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from('custom_size_request_activity').insert({
    request_id: requestId,
    action,
    old_status: oldStatus,
    new_status: newStatus,
    notes,
    created_by: user?.id,
  });
}

export async function getRequestActivity(requestId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('custom_size_request_activity')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }

  return data || [];
}

export async function assignRequestTo(
  requestId: string,
  assignedToUserId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('custom_size_requests')
    .update({ assigned_to: assignedToUserId })
    .eq('id', requestId);

  if (error) {
    console.error('Error assigning request:', error);
    return false;
  }

  await logRequestActivity(requestId, 'assigned', undefined, undefined, `Request assigned`);

  return true;
}

export async function updateRequestPriority(
  requestId: string,
  priority: CustomSizeRequest['priority']
): Promise<boolean> {
  const { error } = await supabase
    .from('custom_size_requests')
    .update({ priority })
    .eq('id', requestId);

  if (error) {
    console.error('Error updating priority:', error);
    return false;
  }

  await logRequestActivity(requestId, 'priority_changed', undefined, undefined, `Priority set to ${priority}`);

  return true;
}
