export interface Client {
  id: string; // uuid
  full_name: string;
  phone?: string | null;
  subscription_type: 'Standard' | 'Premium' | 'VIP';
  status: 'Active' | 'Expired';
  created_at?: string;
  last_visit?: string | null;
}

export interface Coach {
  id: string; // uuid
  name: string;
  specialization: string;
}

export interface AdminUser {
  id: string; // uuid
  username: string;
  password: string;
}