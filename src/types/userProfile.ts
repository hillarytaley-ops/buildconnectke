export interface UserProfile {
  id: string;
  user_id: string;
  role: 'builder' | 'delivery_provider' | 'admin' | null;
  user_type: 'individual' | 'company' | null;
  is_professional: boolean;
  email?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface BuilderState {
  isProfessionalBuilder: boolean;
  isPrivateBuilder: boolean;
  isDeliveryProvider: boolean;
}

export const getUserBuilderState = (userProfile: UserProfile): BuilderState => {
  const isProfessionalBuilder = userProfile.role === 'builder' && 
    (userProfile.user_type === 'company' || userProfile.is_professional);
  const isPrivateBuilder = userProfile.role === 'builder' && userProfile.user_type === 'individual';
  const isDeliveryProvider = userProfile.role === 'delivery_provider';

  return {
    isProfessionalBuilder,
    isPrivateBuilder,
    isDeliveryProvider
  };
};