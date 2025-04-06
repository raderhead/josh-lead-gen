
import { UserType, QuizQuestion } from './types';
import { initialQuestions } from './quizData';

export const getFilteredQuestions = (userType: UserType): QuizQuestion[] => {
  if (userType === null) {
    return [initialQuestions[0]];
  }
  
  return initialQuestions.filter(q => 
    q.forUserType === userType || q.forUserType === 'both'
  );
};

export interface WebhookError {
  error: true;
  message: string;
}

export const sendToWebhook = async (formData: any): Promise<boolean | WebhookError> => {
  try {
    const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/d8f5b13a-ac80-4ae5-8247-27c574036746";
    
    // Use fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 second timeout
    
    // Since this is a GET request, we need to encode the data as URL parameters
    const params = new URLSearchParams();
    
    // Flatten the form data object for URL parameters
    const flattenObject = (obj: any, prefix = '') => {
      for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          flattenObject(value, newKey);
        } else {
          params.append(newKey, JSON.stringify(value));
        }
      }
    };
    
    flattenObject(formData);
    
    // Create the URL with parameters
    const urlWithParams = `${webhookUrl}?${params.toString()}`;
    console.log('Sending GET request to:', urlWithParams);
    
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }
    
    console.log('Webhook response:', await response.text());
    return true;
  } catch (error) {
    console.error('Error sending data to webhook:', error);
    // Instead of throwing, we'll return a formatted error object
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error sending data to webhook'
    };
  }
};
