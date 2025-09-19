// API Configuration for development and production
export const API_CONFIG = {
  // Base URL for API calls - always use relative paths for Vercel
  baseURL: '',
  
  // Endpoints
  endpoints: {
    availability: '/api/appointments/availability',
    checkSlot: '/api/appointments/check-slot',
    createAppointment: '/api/appointments/create',
  }
};

// Helper function to get full URL for API calls
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.baseURL}${endpoint}`;
}

// API client with error handling
export class ApiClient {
  private static async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  static async get(endpoint: string, params?: Record<string, string>) {
    const url = new URL(getApiUrl(endpoint), window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());
    return this.handleResponse(response);
  }

  static async post(endpoint: string, data: Record<string, unknown>) {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

// Specific API functions
export const appointmentApi = {
  async getAvailability() {
    return ApiClient.get(API_CONFIG.endpoints.availability);
  },

  async checkSlot(date: string, time: string) {
    return ApiClient.get(API_CONFIG.endpoints.checkSlot, { date, time });
  },

  async createAppointment(appointmentData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    appointment_date: string;
    appointment_time: string;
    service_type?: string;
    notes?: string;
  }) {
    return ApiClient.post(API_CONFIG.endpoints.createAppointment, appointmentData);
  }
};