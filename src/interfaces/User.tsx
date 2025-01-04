export interface UserData {
  email: string;
  is_active: boolean;
  name: string;
  residential_college?: string;
  notif_pref: boolean;
  graduating_year?: number;
  gender?: number;
  partner_genders?: number;
  instagram?: string;
  snapchat?: string;
  phone_number?: string;
  picture_s3_url?: string;
  interest_1?: string;
  interest_2?: string;
  interest_3?: string;
  interest_4?: string;
  interest_5?: string;
}
